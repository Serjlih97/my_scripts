const BaseCommand = require('./_base');
const helper      = require('../modules/helper');

class Command extends BaseCommand {
    async run() {
        const branch = await helper.git_current_branch();

        if (!branch) {
            console.log('dir not contain git reposetory');
            return 1;
        }

        const [origin] = await helper.exec('git config --get remote.origin.url');

        if (/^http/.test(origin)) {
            const url = origin.replace(/\.[^\.]*$/, '') + '/commits/' + branch;
            console.log(`_BASH open ${url}`);
            return 0;
        }

        const parse = /^.*@((?<host>.*):(?<project>.*))(\/.*){0,}\/(?<repo>.*)\..*$/.exec(origin);

        if (parse === null) {
            console.log(`invalid origin: ${origin}`);
            return 1;
        }

        console.log(`_BASH open https://${parse.groups.host}/${parse.groups.project}/${parse.groups.repo}/commits/${branch}`);
        return 0;
    }
}

module.exports = new Command('branch');
