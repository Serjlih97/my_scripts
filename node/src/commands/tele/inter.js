const BaseCommand = require('../_base');
const helper      = require('../../modules/helper');
const config      = require('../../modules/config');

class Command extends BaseCommand {
    async complete(c) {
        await helper.kube_autocomplete(c, 'services', (services) => {
            return services.map(el => el.replace('-service', ''));
        });

        if (c.fragment < 5) {
            return;
        }

        if (c.fragment < 6) {
            const args      = c.args.slice(3);
            const namespace = args.shift();
            const app       = args.shift();
            const res = await helper.exec(`kubectl get service ${app}-service -n "${namespace}" -o json`);

            if (!res) {
                c.reply([]);
                return;
            }

            const info = JSON.parse(res.map(el => el.trim()).join(''));
            const ports = info.spec.ports.map(el => el.port);

            c.reply(ports);
        } else {
            c.reply([]);
        }
    }

    async run(args) {
        args = args.slice(1);
        const namespace = args.shift();
        const app = args.shift();
        const port = args.shift();
        const local_port = args.shift();

        if (!namespace) {
            console.log('Wrong ns name');
            return 1;
        }

        if (!app) {
            console.log('Wrong app name');
            return 1;
        }

        if (!port) {
            console.log('Wrong port');
            return 1;
        }

        if (!local_port) {
            console.log('Wrong local_port');
            return 1;
        }

        console.log(`_BASH telepresence intercept ${app}-service --port ${local_port}:${port} -n "${namespace}" -w ${app}`);
    }
}

module.exports = new Command('inter');
