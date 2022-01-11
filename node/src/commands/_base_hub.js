const BaseCommand = require('./_base');
const helper      = require('../modules/helper');

class BaseHubCommand extends BaseCommand {
    constructor(name, folder) {
        super(name);
        this.folder = folder;
        this.commands = helper.readCommands(folder);
    }

    async complete(c) {
        c.reply(Object.keys(this.commands));

        if (c.fragment < 3) {
            return;
        }

        const cmd = c.args[2];
        const command = this.commands[cmd];

        if (command && command.complete) {
            const res = await command.complete(c);
            return res;
        }
    }

    run(args) {
        args = args.slice(1);

        const cmd = args[0];
        const command = this.commands[cmd];

        if (!command) {
            console.log('Wrong params');
            return 1;
        }

        return command.run(args);
    }
}

module.exports = BaseHubCommand;
