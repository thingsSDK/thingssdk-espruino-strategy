'use strict';
const espruino = require('espruino');

// TODO: Use a logger and preface each line with the device prompt.
module.exports = function repl(device) {

    espruino.init(() => {
        Espruino.Config.BAUD_RATE = device.baud_rate;
        Espruino.Core.Serial.startListening((data) => {
            process.stdout.write(String.fromCharCode.apply(null, new Uint8Array(data)));
        });
        Espruino.Core.Serial.open(device.port, () => {
            process.stdin.on('readable', () => {
                let chunk = process.stdin.read();
                if (chunk !== null) {
                    chunk = chunk.toString();
                    Espruino.Core.Serial.write(chunk);
                }
            });

        }, () => {
            console.log("Disconnected.");
        });
    });
};
