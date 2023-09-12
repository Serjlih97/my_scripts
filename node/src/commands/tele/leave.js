const BaseCommand = require('../_base');
const helper      = require('../../modules/helper');
const config      = require('../../modules/config');

class Command extends BaseCommand {
    async complete(c) {
        if (c.fragment >= 4)  {
            c.reply([]);
            return;
        }

        const res = await helper.exec('telepresence status --output json');

        if (!res) {
            return;
        }

        const status = JSON.parse(res[0]);
        const intercepts = status.user_daemon?.intercepts?.map(el => el.name) || [];

        c.reply(intercepts);
    }

    async run(args) {
        args = args.slice(1);
        const intercept = args.shift();

        if (!intercept) {
            console.log('Wrong intercept name');
            return 1;
        }

        console.log(`_BASH telepresence leave ${intercept}`);
    }
}

module.exports = new Command('leave');
