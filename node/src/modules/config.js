const fs = require('fs');
const path = `${__dirname}/../../config.json`

if (!fs.existsSync(path)) {
    throw new Error(`File not exist: "${path}"`);
}

module.exports = require(path);
