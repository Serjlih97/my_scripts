const colors      = require('colors');
const BaseCommand = require('../_base');
const helper      = require('../../modules/helper');

class Command extends BaseCommand {
    async run() {
        let containers = await helper.get_docker_containers('run');

        containers.forEach(container => console.log(colors.green(container)));

        containers = await helper.get_docker_containers('noRun');

        containers.forEach(container => console.log(container));

        return 0;
    }
}

module.exports = new Command('status');
