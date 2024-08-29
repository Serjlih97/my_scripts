const BaseCommand = require('../_base');
const helper      = require('../../modules/helper');

class Command extends BaseCommand {
    complete(c) {
        return helper.kube_autocomplete(c, 'service_apps', false, true);
    }

    run(args) {
        args = args.slice(1);
        const namespace = args.shift();
        const apps = args;

        if (!namespace) {
            console.log('Wrong ns name');
            return 1;
        }

        let filters = '';

        if (apps.length > 0) {
            filters = ` -l "app in (${apps.join(', ')})"`
        }

        console.log(`_BASH sudo kubefwd svc -n "${namespace}"${filters}`);
    }
}

module.exports = new Command('kubefwd');
