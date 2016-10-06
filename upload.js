/* Upload file */
'use strict';
const path = require('path');
const utils = require('./utils');

module.exports = function upload(devices, payload, next) {
    let espruinoDevices = utils.filterDevices(devices);
    espruinoDevices.forEach(device => {
        let filePath = path.join(payload.buildDir, 'espruino-generated.js');
        console.log(`Sending code to device - ${device.port} @ ${device.baud_rate} baud...`);
        utils.runEspruino(device, '-c', filePath);
    });
    next();
};
