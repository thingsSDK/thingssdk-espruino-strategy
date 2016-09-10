/* Upload file */
'use strict';
const espruino = require('espruino');
const utils = require('./utils');


function uploadToDevice(device, code) {
    console.log(`Sending code to device - ${device.port} @ ${device.baud_rate} baud...`);
    utils.mute((unmute) => {
        espruino.init(() => {
            Espruino.Config.BAUD_RATE = device.baud_rate;
            espruino.sendCode(device.port, code, () => {
                unmute();
                console.log(`Code sent to ${device.port}`);
                // FIXME: Espruino is holding the process open
                process.exit();
            });
        });
    });
}

module.exports = function upload(devices, payload, next) {
    let espruinoDevices = utils.filterDevices(devices);
    espruinoDevices.forEach(device => uploadToDevice(device, payload.code));
    next();
};
