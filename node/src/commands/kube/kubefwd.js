const BaseCommand = require('../_base');
const helper      = require('../../modules/helper');

class Command extends BaseCommand {
    complete(c) {
        return helper.kube_autocomplete(c, 'namespaces');
    }

    run(args) {
        args = args.slice(1);
        const namespace = args.shift();

        if (!namespace) {
            console.log('Wrong ns name');
            return 1;
        }

        console.log(`_BASH sudo kubefwd svc -n "${namespace}" -d kb.local`);
    }
}

module.exports = new Command('kubefwd');
