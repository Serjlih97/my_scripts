const BaseCommand = require('../_base');
const helper      = require('../../modules/helper');

class Command extends BaseCommand {
    complete(c) {
        return helper.docker_autocomplete(c, 'run', true);
    }

    run(args) {
        args = args.slice(1);

        console.log(`_BASH docker restart ${args.join(' ')}`);
    }
}

module.exports = new Command('restart');
