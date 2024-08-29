const BaseCommand = require('../_base');
const helper      = require('../../modules/helper');

class Command extends BaseCommand {
    async run() {
        const branch = await helper.git_current_branch();

        if (!branch) {
            console.log('dir not contain git reposetory');
            return 1;
        }

        console.log(`_BASH git checkout master && git pull origin master && git checkout ${branch}`);
    }
}

module.exports = new Command('pm');
