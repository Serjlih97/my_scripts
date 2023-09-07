const fs            = require('fs');
const child_process = require('child_process');
const config        = require('../modules/config');
const BaseCommand   = require('../commands/_base');

class Helper {
    exec(command, exeption = false) {
        return new Promise((resolve, reject) => {
            child_process.exec(command, {}, (error, result) => {
                if (error) {
                    if (exeption) {
                        return reject(error);
                    }

                    return resolve(false);
                }
                result = result.split('\n');

                return resolve(result);
            });
        });
    }

    async git_current_branch() {
        const res = await this.exec('git rev-parse --abbrev-ref HEAD');

        if (!res) {
            return false;
        }

        return res[0];
    }

    async get_docker_containers(type = 'all') {
        let command = 'docker ps';

        if (!type || type == 'all') {
            command += ' -a';
        }

        if (type == 'noRun') {
            command += ' --filter status=dead --filter status=paused --filter status=exited';
        }

        if (type == 'run') {
            command += ' --filter status=running';
        }

        command += ' --format "{{.Names}}"';

        const res = await this.exec(command);

        return res;
    }

    async docker_autocomplete(c, type, multy = false) {
        if (!multy) {
            if (c.fragment < 4) {
                let containers = await this.get_docker_containers(type);
                c.reply(containers);
            } else {
                c.reply([])
            }
            return;
        }

        let args       = c.args.slice(3);
        let containers = await this.get_docker_containers(type);

        if (!containers) {
            return;
        }

        this.multi_complite(c, args, containers);
    }

    multi_complite(c, args, list) {
        if (!c.complete) {
            args.pop();
        }

        args.forEach(el => c.reply([el]));

        list = list.filter(el => args.indexOf(el) == -1);

        c.reply(list);
    }

    async get_kube_namespaces() {
        const file_name = __dirname + '/../../tmp/kube_namespaces';

        if (fs.existsSync(file_name)) {
            const namespaces = JSON.parse(fs.readFileSync(file_name));
            return namespaces;
        }

        const res = await this.exec('kubectl get ns --no-headers -o custom-columns=NAME:.metadata.name');

        if (!res) {
            return res;
        }

        fs.writeFileSync(file_name, JSON.stringify(res));

        return res;
    }

    async get_kube_pods(namespace) {
        const file_name = __dirname + '/../../tmp/kube_pods';
        let pods = {};

        if (fs.existsSync(file_name)) {
            pods = JSON.parse(fs.readFileSync(file_name));

            if (pods[namespace] && pods[namespace].expire_dttm > Date.now()) {
                return pods[namespace].pods;
            }
        }

        const res = await this.exec(`kubectl -n ${namespace} get pods -o=jsonpath="{.items[*]['metadata.name']}"`)

        if (!res) {
            return res;
        }

        pods[namespace] = {
            pods        : res[0].split(' '),
            expire_dttm : Date.now() + config.kube.pods_expire_ms,
        };

        fs.writeFileSync(file_name, JSON.stringify(pods));

        return pods[namespace].pods;
    }

    async get_kube_apps(namespace) {
        const file_name = __dirname + '/../../tmp/kube_apps';
        let apps = {};

        if (fs.existsSync(file_name)) {
            apps = JSON.parse(fs.readFileSync(file_name));

            if (apps[namespace] && apps[namespace].expire_dttm > Date.now()) {
                return apps[namespace].apps;
            }
        }

        const res = await this.exec(`kubectl -n ${namespace} get pods -o=jsonpath="{.items[*]['metadata.labels.app']}"`)

        if (!res) {
            return res;
        }

        apps[namespace] = {
            apps        : res[0].split(' '),
            expire_dttm : Date.now() + config.kube.pods_expire_ms,
        };

        fs.writeFileSync(file_name, JSON.stringify(apps));

        return apps[namespace].apps;
    }

    async get_kube_services(namespace) {
        const file_name = __dirname + '/../../tmp/kube_services';
        let services = {};

        if (fs.existsSync(file_name)) {
            services = JSON.parse(fs.readFileSync(file_name));

            if (services[namespace] && services[namespace].expire_dttm > Date.now()) {
                return services[namespace].services;
            }
        }

        const res = await this.exec(`kubectl -n ${namespace} get services -o=jsonpath="{.items[*]['metadata.name']}"`)

        if (!res) {
            return res;
        }

        services[namespace] = {
            services        : res[0].split(' '),
            expire_dttm : Date.now() + config.kube.pods_expire_ms,
        };

        fs.writeFileSync(file_name, JSON.stringify(services));

        return services[namespace].services;
    }

    async kube_autocomplete(c, type = 'pods', filter = false) {
        if (c.fragment < 4)  {
            const namespaces = await this.get_kube_namespaces();
            c.reply(namespaces);
            return;
        } else {
            c.reply([]);
        }

        if (type == 'namespaces') {
            return;
        }

        if (c.fragment < 5) {
            let args        = c.args.slice(3);
            const namespace = args[0];
            let res         = [];

            if (type == 'pods') {
                res = await this.get_kube_pods(namespace);
            }

            if (type == 'apps') {
                res = await this.get_kube_apps(namespace);
            }

            if (type == 'services') {
                res = await this.get_kube_services(namespace);
            }

            if (filter) {
                res = filter(res, c, type);
            }

            c.reply(res);
        } else {
            c.reply([]);
        }
    }

    readCommands(path) {
        let cmds = {};

        fs.readdirSync(path).forEach((file) => {
            const stat = fs.lstatSync(`${path}/${file}`);

            if (stat.isDirectory()) {
                return;
            }

            if (!stat.isFile()) {
                return;
            }

            const res = require(`${path}/${file}`);

            if (!(res instanceof BaseCommand)) {
                return;
            }

            cmds[res.name] = res;
        });

        return cmds;
    }

    parseArgs(args) {
        let flags = {};
        let out_args = [];

        for (let i = 0; i < args.length; i++) {
            const el = args[i];

            if (el[0] != '-') {
                out_args.push(el);
                continue;
            }

            const val = true;

            if (args[i + 1] && args[i + 1][0] != '-') {
                val = args[i + 1];
                i++;
            }

            flags[el.replaceAll('-', '')] = val;
        }

        return {
            flags,
            args: out_args,
        };
    }
}

module.exports = new Helper();
