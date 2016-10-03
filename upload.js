/* Upload file */
'use strict';
const path = require('path');
const utils = require('./utils');

function uploadToDevice(device, filePath) {
    console.log(`Sending code to device - ${device.port} @ ${device.baud_rate} baud...`);

    utils.runEspruino(device, '-c', filePath);
}

module.exports = function upload(devices, payload, next) {
    let espruinoDevices = utils.filterDevices(devices);
    espruinoDevices.forEach(device => {
        return uploadToDevice(device, path.join(payload.buildDir, 'espruino-generated.js'));
    });
    next();
};
