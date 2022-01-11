const fs          = require('fs');
const BaseCommand = require('./_base');
const helper      = require('../modules/helper');

class Command extends BaseCommand {
    async complete(c) {
        let files = [];

        fs.readdirSync(`${__dirname}/../../tmp/`).forEach((file) => {
            if (file == '.gitkeep') {
                return;
            }

            files.push(file);
        });

        helper.multi_complite(c, c.args.slice(2), files);
    }

    run(args) {
        args = args.slice(1).map(el => {
            return `${__dirname}/../../tmp/${el}`;
        });

        if (args.length <= 0) {
            console.log(`rm -rf ${__dirname}/../../tmp/*`);
            console.log(`_BASH rm -rf ${__dirname}/../../tmp/*`);
        } else {
            console.log(`rm -rf ${args.join(' ')}`);
            console.log(`_BASH rm -rf ${args.join(' ')}`);
        }
    }
}

module.exports = new Command('ctmpl');
