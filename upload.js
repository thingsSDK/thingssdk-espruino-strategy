/* Upload file */
'use strict';
const espruino = require('espruino');

function uploadToDevice(device, code) {
    console.log(`Sending code to device - ${device.port} @ ${device.baud_rate} baud...`);
    espruino.init(() => {
    	Espruino.Config.BAUD_RATE = device.baud_rate;
        Espruino.Config.NPM_MODULES = true;
        espruino.sendCode(device.port, code, () => {
        	console.log(`Code sent to ${device.port}`);
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