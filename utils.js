'use strict';
const path = require('path');
const spawn = require('child_process').spawn;


function filterDevices(devices) {
    return Object.keys(devices)
            .filter(port => devices[port].runtime === "espruino")
            .map(port => Object.assign({port}, devices[port]));
}

function runEspruino(device, ...cmdLineArgs) {
    let output = function(msg) {
        msg = "" + msg;
        // Avoid cases where it is re-printing exactly what we are typing
        if (msg.endsWith("\n")) {
            msg = `${device.runtime}:  ${msg}`;
        }
        process.stdout.write(msg);
    };
    let espruinoCmd = spawn('node', [
        path.join('node_modules', 'espruino', 'bin', 'espruino-cli'),
        '-b', device.baud_rate,
        '-p', device.port,
        ...cmdLineArgs
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
    return espruinoCmd;

}

module.exports = {
    filterDevices,
    runEspruino
};