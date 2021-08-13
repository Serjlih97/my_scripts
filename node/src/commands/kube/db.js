const BaseCommand = require('../_base');
const helper      = require('../../modules/helper');
const config      = require('../../modules/config');

const dbs = config.dbs.map(el => el.name);

class Command extends BaseCommand {
    complete(c) {
        return helper.kube_autocomplete(c, 'apps', (apps) => {
            return apps.filter(el => dbs.includes(el));
        });
    }

    run(args) {
        args = args.slice(1);
        const namespace = args.shift();
        const app = args.shift();
        const [db_config] = config.dbs.filter(el => el.name == app);

        if (!namespace) {
            console.log('Wrong ns name');
            return 1;
        }

        if (!app) {
            console.log('Wrong app name');
            return 1;
        }

        if (!db_config) {
            console.log(`Dosn\`t exist config for db "${app}"`);
            return 1;
        }

        console.log(`_BASH kubectl -n "${namespace}" port-forward "deployment/${app}" ${db_config.local_port}:${db_config.port}`);
    }
}

module.exports = new Command('db');
