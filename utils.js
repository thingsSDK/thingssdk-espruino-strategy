'use strict';



function filterDevices(devices) {
    return Object.keys(devices)
            .filter(port => devices[port].runtime === "espruino")
            .map(port => Object.assign({port}, devices[port]));
}

// This is a curried function (I think)
function outputForDevice(device) {
    return (msg) => {
        msg = "" + msg;
        // Avoid cases where it is re-printing exactly what we are typing
        if (msg.endsWith("\n")) {
            msg = `${device.runtime}:  ${msg}`;
        }
        process.stdout.write(msg);
    };
}

module.exports = {
    filterDevices,
    outputForDevice
};