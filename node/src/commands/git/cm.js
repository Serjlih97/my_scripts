const BaseCommand = require('../_base');
const helper      = require('../../modules/helper');

class Command extends BaseCommand {
    async complete(c) {
        const tags = ['--no-verify'];

        if (c.fragment < 3)  {
            c.reply([]);
            return;
        }

        helper.multi_complite(c, c.args.slice(3), tags);
    }

    async run(args) {
        args = args.slice(1);
        const message = args.shift();

        if (!message) {
            console.log('need commit message');
            return 1;
        }

        const branch = await helper.git_current_branch();

        if (!branch) {
            console.log('dir not contain git reposetory');
            return 1;
        }

        let prefix = '';

        if (!helper.isMasterBranch(branch)) {
            try {
                const task = helper.getTaskName(branch);

                prefix = `${task} - `;
            } catch (error) {
                console.log(error.message);
                return 1;
            }
        }

        console.log(`_BASH git commit -m "${prefix}${message}"  ${args.join(' ')}`);
    }
}

module.exports = new Command('cm');
