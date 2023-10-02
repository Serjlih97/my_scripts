const BaseCommand = require('../_base');
const helper      = require('../../modules/helper');
const config      = require('../../modules/config');

class Command extends BaseCommand {
    complete(c) {
        return helper.kube_autocomplete(c, 'deployments');
    }

    run(args) {
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

        console.log(`_BASH kubectl -n "${namespace}" port-forward "deployment/${app}" ${local_port}:${port}`);
    }
}

module.exports = new Command('port');
