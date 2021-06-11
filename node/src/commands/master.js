const BaseCommand = require('./_base');
const helper      = require('../modules/helper');

class Command extends BaseCommand {
    async run() {
        console.log(`_BASH git checkout master`);
        return 0;
    }
}

module.exports = new Command('master');
