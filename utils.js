'use strict';

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


function filterDevices(devices) {
    return Object.keys(devices)
            .filter(port => devices[port].runtime === "espruino")
            .map(port => Object.assign({port}, devices[port]));
}

module.exports = {
    filterDevices,
    mute
};