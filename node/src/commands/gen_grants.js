const BaseCommand = require('./_base');
const helper      = require('../modules/helper');
const path = require('path');
const fs = require('fs');
const parser = require('pgsql-parser');
const astparser = require('pgsql-ast-parser');
const jp = require('jsonpath');

const functions = {
    'events.publish': 'GRANT EXECUTE ON FUNCTION events.publish(_name text, _domain text, _data jsonb, _routing_key text) TO {user_name};',
    'events_sporthub.publish': 'GRANT EXECUTE ON FUNCTION events_sporthub.publish(_name text, _domain text, _data jsonb, _routing_key text) TO {user_name};'
};

class Command extends BaseCommand {
    run(params) {
        const {
            flags,
            args
        } = helper.parseArgs(params.slice(1));
        const user_name = args.shift();
        const sql_file = args.shift();

        if (!user_name) {
            console.log('Требуется задать имя пользователя');
            return 1;
        }

        if (!sql_file) {
            console.log('Требуется задать путь к файлу с sql-запросом');
            return 1;
        }

        const sql_file_path = path.join(process.cwd(), sql_file);

        if (!fs.existsSync(sql_file_path)) {
            console.log(`Файл не найден по пути "${sql_file_path}"`);
            return 1;
        }

        let descriptor = fs.openSync(sql_file_path, 'r');
        let sql_queries = fs.readFileSync(descriptor, 'utf8');
        let parse_mode = 'node';

        if (/{{[^{]*define /.test(sql_queries)) {
            parse_mode = 'go'
        }

        let query_rows = [];

        switch (parse_mode) {
            case 'node': {
                query_rows = sql_queries.split('--').splice(1).map(el => {
                    const query = el.trim();
                    let [name, clean_query] = query.split('://');

                    clean_query = clean_query.replace(/\${([^}]+)}/g, `'$1'`);
                    clean_query = clean_query.replace(/VALUES ('[^']+')/g, `VALUES ($1)`);

                    return {
                        name,
                        clean_query,
                        query,
                    };
                }).filter(el => !el.name.endsWith('_tmpl'));
                break;
            }
            case 'go': {
                query_rows = sql_queries.split('define').splice(1).map(el => {
                    const query = el.trim();
                    const name = /[^"]*\"(?<name>[^"]+)"[^}]*}}/.exec(query).groups.name;

                    let clean_query = query.replace(/[^"]*\"[^"]+"[^}]*}}/, '');

                    clean_query = clean_query.split(/{{[^{]*end[^}]*}}/).at(0);
                    clean_query = clean_query.replace(/\$(\d+)/g, `'$1'`);

                    return {
                        name,
                        clean_query,
                        query,
                    };
                });
                break;
            }
        }
        const tables = new Map();
        const errors = [];
        const grants = new Map();

        for (let query of query_rows) {
            const { name, clean_query } = query;

            try {
                const res = parser.parse(clean_query);
                const paths = jp.paths(res, '$..schemaname');

                paths.forEach(path => {
                    path.splice(-1)
                    const val = jp.value(res, path);
                    const action = path.filter(el => el.toString().endsWith('Stmt')).at(-1);
                    const table = `${val.schemaname}.${val.relname}`;

                    if (!tables.has(table)) {
                        tables.set(table, new Set());
                    }

                    tables.get(table).add(action);
                });

                const fun_paths = jp.paths(res, '$..funcname');

                fun_paths.forEach(path => {
                    const val = jp.value(res, path).map(el => el.String.str);

                    if (val.length == 1 || val[0] == 'public') {
                        return;
                    }

                    const func = val.join('.');

                    if (!functions[func]) {
                        return;
                    }

                    const schema = val[0];

                    if (!grants.has(schema)) {
                        grants.set(schema, new Set());
                    }

                    grants.get(schema).add(functions[func].replaceAll('{user_name}', user_name));
                });
            } catch (error) {
                try {
                    astparser.parse(clean_query);
                } catch (parse_error) {
                    parse_error.toJSON = () => {
                        return {
                            message: parse_error.message,
                            offset: parse_error.offset,
                        };
                    };
                    errors.push({
                        name: name,
                        error: parse_error,
                        clean_query,
                    });
                    continue;
                }

                errors.push({
                    name: name,
                    error: error,
                    clean_query,
                });
                continue;
            }
        }

        Array.from(tables.keys()).sort().forEach(key => {
            const schema = key.split('.').at(0);

            if (!grants.has(schema)) {
                grants.set(schema, new Set());
            }

            const table_grants = Array.from(tables.get(key)).sort().map(el => el.replace('Stmt', '').toUpperCase()).join(', ');
            const query = `GRANT ${table_grants} ON ${key} TO ${user_name};`

            grants.get(schema).add(query);
        });

        if (!flags.errors) {
            const out = [];
            grants.forEach((value, key) => {
                out.push(`GRANT USAGE ON SCHEMA ${key} TO ${user_name};`, '');
                Array.from(value).forEach(el => {
                    out.push(el, '');
                });
                out.push('');
            });

            console.log(out.join('\n\r').trim());
        }

        if (errors.length) {
            console.log(`Errors: ${errors.length}`);

            if (flags.errors) {
                console.log(JSON.stringify(errors, null, 4));
            }
        }
    }
}

module.exports = new Command('gen_grants');
