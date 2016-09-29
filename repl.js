'use strict';
const spawn = require('child_process').spawn;

module.exports = function repl(device) {
    console.log('Connecting REPL...');

    let espruinoCmd = spawn('espruino', ['-b', device.baud_rate], {
        // Because spawned processes don't support setRawMode we need to pass our stdin thru
        stdio: ['inherit', 'pipe', 'pipe'],
        detached: true
    });

    function output(msg) {
        msg = "" + msg;
        // Avoid cases where it is re-printing exactly what we are typing
        if (msg.endsWith("\n")) {
            msg = `${device.runtime}:  ${msg}`;
        }
        process.stdout.write(msg);
    }

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
