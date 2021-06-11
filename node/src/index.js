const fs          = require('fs');
const omelette    = require('omelette');
const helper      = require('./modules/helper');

const commands = helper.readCommands(__dirname + '/commands');
const args     = process.argv.slice(2);

const completion = async (fragment, c) => {
    const tags = [];
    c.args = process.argv.slice(-1)[0].split(' ')
    c.complete = c.args.slice(-1)[0] == '';

    if (c.complete) {
        c.args.pop();
    }

    const command_name = c.args[1];
    c.arg = c.args[c.fragment];

    if (c.fragment < 2) {
        return c.reply([...Object.keys(commands), tags])
    }

    const command = commands[command_name];
    const result = [];

    if (command && command.complete) {
        await command.complete(c);
    }
};

const run = async (comp) => {
    if (~process.argv.indexOf('--setup')) {
        comp.setupShellInitFile()
        return 0;
    }

    if (~process.argv.indexOf('--cleanup')) {
        comp.cleanupShellInitFile()
        return 0;
    }

    const cmd = args[0];

    const command = commands[cmd];

    if (command) {
        return await command.run(args);
    }

    console.log(`Command not found "${cmd}"`);
    return 1;
}

module.exports = () => new Promise((resolve, reject) => {
    const comp = omelette(`my`);

    comp.onAsync('complete', async (fragment, c) => {
        await completion(fragment, c);
        resolve();
    });

    comp.next(async () => {
        const res = await run(comp);
        resolve(res);
    });

    comp.init();
});
