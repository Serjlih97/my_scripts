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

        console.log(`_BASH kubectl get pod -n "${namespace}" -o jsonpath="{range .items[?(@.status.containerStatuses[*].restartCount>0)]}{.metadata.name}{'\\n'}{end}"`);
    }
}

module.exports = new Command('get_restart_pods');
