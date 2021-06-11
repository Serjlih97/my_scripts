const BaseCommand = require('./_base');

class Command extends BaseCommand {
    run() {
        console.log(`_BASH rm -rf ${__dirname}/../../tmp/*`);
    }
}

module.exports = new Command('ctmpl');
