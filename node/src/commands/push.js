const BaseCommand = require('./_base');
const helper      = require('../modules/helper');

const labels = ['breaking-changes', 'bugfix', 'docs', 'enhancement', 'feature'];
const master_branches = ['master', 'cupis_master'];

class Command extends BaseCommand {
    async complete(c) {
        const branch = await helper.git_current_branch();
        const tags = ['--force'];

        if (master_branches.indexOf(branch) != -1) {
            if (c.fragment >= 3) {
                return;
            }

            c.reply(tags);
            return;
        }

        if (c.fragment < 3) {
            return c.reply([...labels, ...tags]);
        }

        if (c.fragment < 4 && tags.indexOf(c.args[2]) == -1) {
            return c.reply(tags);
        }
    }

    async run(args) {
        args = args.slice(1);
        const branch = await helper.git_current_branch();

        if (!branch) {
            console.log('dir not contain git reposetory');
            return 1;
        }

        let command = `git push origin ${branch}`;

        if (master_branches.indexOf(branch) == -1) {
            command += ' -o merge_request.create';
            const label = args[0];

            const res = await helper.exec(`git show-branch remotes/origin/${branch}`);

            if (labels.indexOf(label) != -1) {
                args = args.slice(1);
                command += ` -o merge_request.label=${label}`
            } else if (!res) {
                console.log('label is require for first push');
                return 1;
            }
        }

        command += ' ' + args.join(' ');

        console.log(`_BASH ${command}`);
    }
}

module.exports = new Command('push');
