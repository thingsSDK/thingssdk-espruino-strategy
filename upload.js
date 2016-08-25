/* Upload file */
'use strict';
const espruino = require('espruino');

/**
 * Espruino libraries use console.log directly.  This silences code in `fn` until the `callback` is called.
 */
function mute(fn) {
    let oldLog = console.log;
    console.log = Function.prototype;
    fn.call(null, () => {
        console.log = oldLog;
    });
}

function uploadToDevice(device, code) {
    console.log(`Sending code to device - ${device.port} @ ${device.baud_rate} baud...`);
    mute((unmute) => {
        espruino.init(() => {
            Espruino.Config.BAUD_RATE = device.baud_rate;
            espruino.sendCode(device.port, code, () => {
                unmute();
                console.log(`Code sent to ${device.port}`);
            });
        });
    });

}

module.exports = function upload(devices) {
    let espruinoDevices = Object.keys(devices)
                            .filter(port => devices[port].runtime === "espruino")
                            .map(port => Object.assign({port}, devices[port]));

    return (code) => {
        espruinoDevices.forEach(device => uploadToDevice(device, code));
    };
};
