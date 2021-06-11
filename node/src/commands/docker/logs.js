const clc         = require("cli-color");
const BaseCommand = require('../_base');
const helper      = require('../../modules/helper');

class Command extends BaseCommand {
    complete(c) {
        return helper.docker_autocomplete(c, 'run')
    }

    run(args) {
        args = args.slice(1);

        console.log(`_BASH docker logs ${args.join(' ')}`);
    }
}

module.exports = new Command('logs');
