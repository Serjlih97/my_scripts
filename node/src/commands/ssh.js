const BaseCommand = require('./_base');
const helper      = require('../modules/helper');
const config      = require('../modules/config');

class Command extends BaseCommand {
    complete(c) {
        c.reply(config.sshs.map(({name}) => name));
    }

    async run(args) {
        args           = args.slice(1);
        const ssh_name = args[0];
        const ssh      = config.sshs.find(({name}) => name == ssh_name);

        if (!ssh) {
            console.log(`unknown ssh "${ssh_name}"`);
            return;
        }

        console.log(`_BASH ssh ${ssh.user}@${ssh.host} -p ${ssh.port}`);
    }
}

module.exports = new Command('ssh');
