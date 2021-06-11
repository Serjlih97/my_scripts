const clc         = require("cli-color");
const BaseCommand = require('../_base');
const helper      = require('../../modules/helper');

class Command extends BaseCommand {
    run() {
        return helper.docker_autocomplete(c, 'run', true);
    }
}

module.exports = new Command('status');
