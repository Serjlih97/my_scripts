#! /usr/bin/env node

const command = require('./src');

(async () => {
    const exitCode = await command();

    if (exitCode) {
        process.exit(exitCode);
    }
})();
