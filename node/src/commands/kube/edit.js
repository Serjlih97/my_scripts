const BaseCommand = require('../_base');
const helper      = require('../../modules/helper');

class Command extends BaseCommand {
    complete(c) {
        return helper.kube_autocomplete(c, 'deployments');
    }

    run(args) {
        args = args.slice(1);
        const namespace = args.shift();
        const app = args.shift();

        if (!namespace) {
            console.log('Wrong ns name');
            return 1;
        }

        if (!app) {
            console.log('Wrong app name');
            return 1;
        }

        console.log(`_BASH kubectl -n "${namespace}" edit "deployments/${app}"`);
    }
}

module.exports = new Command('edit');
