const BaseCommand = require('../_base');
const helper      = require('../../modules/helper');
const config      = require('../../modules/config');

class Command extends BaseCommand {
    complete(c) {
        return helper.kube_autocomplete(c, 'apps');
    }

    async run(args) {

        // let res = await helper.exec(`kubectl -n "bboncyp-toto-staging" get pods -o=jsonpath="{range .items[*]}{.spec.containers[0].ports}{' split '}{.metadata.name}{'\\n'}{end}" | grep containerPort`, true);

        // res = res.filter(el => el);

        // const result = res.map(el => {
        //     const [
        //         ports_row,
        //         pod,
        //     ] = el.split(' split ');

        //     const ports = JSON.parse(ports_row).map(el => el.containerPort);

        //     return {
        //         pod   : pod,
        //         ports : ports,
        //     };
        // });

        // console.log(result, res);

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
