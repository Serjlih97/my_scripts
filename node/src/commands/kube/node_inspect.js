const BaseCommand = require('../_base');
const helper      = require('../../modules/helper');

class Command extends BaseCommand {
    complete(c) {
        return helper.kube_autocomplete(c, 'pods');
    }

    run(args) {
        args = args.slice(1);
        const namespace = args.shift();
        const pod = args.shift();

        if (!namespace) {
            console.log('Wrong ns name');
            return 1;
        }

        if (!pod) {
            console.log('Wrong pod name');
            return 1;
        }

        console.log(`_BASH kubectl -n "${namespace}" port-forward "${pod}" 9222:${9229}`);
    }
}

module.exports = new Command('node_inspect');
