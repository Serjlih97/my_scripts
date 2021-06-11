const clc         = require("cli-color");
const BaseCommand = require('../_base');
const helper      = require('../../modules/helper');

class Command extends BaseCommand {
    complete(c) {
        return helper.docker_autocomplete(c, 'run')
    }

    run(args) {
        args = args.slice(1);
        const container = args.pop();

        console.log(`_BASH docker exec -it ${container} bash ${args.join(' ')}`);
    }
}

module.exports = new Command('exec');
