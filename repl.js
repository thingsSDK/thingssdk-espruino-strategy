'use strict';
const utils = require('./utils');

module.exports = function repl(device) {
    console.log('Connecting REPL...');
    utils.runEspruino(device);
};
