'use strict';
const spawn = require('child_process').spawn;
const utils = require('./utils');

module.exports = function repl(device) {
    console.log('Connecting REPL...');

    let espruinoCmd = spawn('espruino', ['-b', device.baud_rate], {
        // Because spawned processes don't support setRawMode we need to pass our stdin thru
        stdio: ['inherit', 'pipe', 'pipe'],
        detached: true
    });

    let output = utils.outputForDevice(device);

    espruinoCmd.stdout.on('data', data => {
         output(data.toString());
    });

    espruinoCmd.stderr.on('data', data => {
         output(data.toString());
    });

    espruinoCmd.on('close', code => {
        output('Exited with status ' + code);
    });
};
