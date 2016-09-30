'use strict';
const path = require('path');
const spawn = require('child_process').spawn;
const utils = require('./utils');

module.exports = function repl(device) {
    console.log('Connecting REPL...');

    utils.runEspruino(device);
};
