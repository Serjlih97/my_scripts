const BaseCommand = require('./_base');
const helper      = require('../modules/helper');

class Command extends BaseCommand {
    async run(args) {
        args = args.slice(1);
        const branch = await helper.git_current_branch();

        if (!branch) {
            console.log('dir not contain git reposetory');
            return 1;
        }

        console.log(`_BASH git pull origin ${branch} ${args.join(' ')}`);
    }
}

module.exports = new Command('pull');
