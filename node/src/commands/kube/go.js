const clc         = require("cli-color");
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

        console.log(`_BASH open "https://bb-test2-dashboard.bb-online-stage.com/#/pod/${namespace}/${pod}?namespace=${namespace}"`);
    }
}

module.exports = new Command('go');
