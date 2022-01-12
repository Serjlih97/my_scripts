const BaseCommand = require('./_base');
const helper      = require('../modules/helper');

const labels = ['breaking-changes', 'bugfix', 'docs', 'enhancement', 'feature', 'refactor'];
const master_branches = ['master', 'cupis_master'];

class Command extends BaseCommand {
    async complete(c) {
        const branch = await helper.git_current_branch();
        const tags = ['--force'];

        if (master_branches.indexOf(branch) == -1) {
            c.reply([...labels, ...tags]);
        }

        c.reply(tags);
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
            const label = args[0];

            const res = await helper.exec(`git show-branch remotes/origin/${branch}`);

            if (labels.indexOf(label) != -1) {
                args = args.slice(1);
                command += ` -o merge_request.create -o merge_request.title=${branch} -o merge_request.description="$(git log -1 --pretty=%s)" -o merge_request.label=${label}`
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
