const BaseCommand = require('./_base');
const helper      = require('../modules/helper');

class Command extends BaseCommand {
    async run(args) {
        const branch = await helper.git_current_branch();

        if (!branch) {
            console.log('dir not contain git reposetory');
            return 1;
        }

        try {
            const task = helper.getTaskName(branch);

            console.log(`_BASH open https://media-life.atlassian.net/browse/${task}`);
            return 0;
        } catch (error) {
            console.log(error.message);
            return 1;
        }
    }
}

module.exports = new Command('task');
