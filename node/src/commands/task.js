const BaseCommand = require('./_base');
const helper      = require('../modules/helper');

const dashboards = ['ONL', 'BACK', 'XX', 'SPOR', 'CRM', 'RED', 'DK', 'FEED', 'BET'];
const default_dashboard = dashboards[0];

class Command extends BaseCommand {
    async run(args) {
        const branch = await helper.git_current_branch();

        if (!branch) {
            console.log('dir not contain git reposetory');
            return 1;
        }

        const res = /^(?<name>[^-_]+)[-_](?<task>[0-9]+)/.exec(branch);

        if (!res || !res.groups || !res.groups.task) {
            console.log('branch must be of the format .*[-_][0-9]+');
            return 1;
        }

        let dashboard = res.groups.name.toUpperCase();

        if (dashboards.indexOf(dashboard) == -1) {
            dashboard = default_dashboard;
        }

        console.log(`_BASH open https://bingoboom.atlassian.net/browse/${dashboard}-${res.groups.task}`);
        return 0;
    }
}

module.exports = new Command('task');
