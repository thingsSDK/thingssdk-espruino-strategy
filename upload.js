/* Upload file */
'use strict';
const path = require('path');
const espruino = require('espruino');
const utils = require('./utils');


function uploadToDevice(device, filePath) {
    console.log(`Sending code to device - ${device.port} @ ${device.baud_rate} baud...`);

    const spawn = require('child_process').spawn;

    let output = utils.outputForDevice(device);

    let espruinoCmd = spawn('node', [
        path.join('node_modules', 'espruino', 'bin', 'espruino-cli'), 
        '-b', device.baud_rate,
        '-p', device.port,
        '-c',
        filePath
    ], {
            // Because spawned processes don't support setRawMode we need to pass our stdin thru
            stdio: ['inherit', 'pipe', 'pipe'],
            detached: true
        });

    espruinoCmd.stdout.on('data', data => {
        output(data.toString());
    });

    espruinoCmd.stderr.on('data', data => {
        output(data.toString());
    });

    espruinoCmd.on('close', code => {
        output(`Exited with status ${code}`);
    });

    espruinoCmd.on('error', err => {
        console.error(`Error: ${err.message}`);
    });
}

module.exports = function upload(devices, payload, next) {
    let espruinoDevices = utils.filterDevices(devices);
    espruinoDevices.forEach(device => {
        return uploadToDevice(device, path.join(payload.buildDir, 'espruino-generated.js'));
    });
    next();
};
