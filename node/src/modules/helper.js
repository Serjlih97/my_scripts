const fs            = require('fs');
const child_process = require('child_process');
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
        const res = await this.exec('git branch');

        if (!res) {
            return false;
        }

        return res.find(el => /^\* .*/.test(el)).replace('* ', '');
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
                return c.reply(containers);
            }
            return;
        }

        let args = c.args.slice(3);

        if (!c.complete) {
            args.pop();
        }

        let containers = await this.get_docker_containers(type);

        if (!containers) {
            return 0;
        }

        containers = containers.filter(el => args.indexOf(el) == -1);

        return c.reply(containers);
    }

    async get_kube_namespaces() {
        const file_name = __dirname + '/../../tmp/namespaces';

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
        const res = await this.exec(`kubectl -n ${namespace} get pods -o=jsonpath="{.items[*]['metadata.name']}"`)

        return res;
    }

    async get_kube_apps(namespace) {
        const res = await this.exec(`kubectl -n ${namespace} get pods -o=jsonpath="{.items[*]['metadata.labels.app']}"`)

        return res;
    }

    async kube_autocomplete(c, type = 'pods') {
        if (c.fragment < 4) {
            const namespaces = await this.get_kube_namespaces();
            return c.reply(namespaces);
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
            return c.reply(res);
        }

        return;
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
}

module.exports = new Helper();
