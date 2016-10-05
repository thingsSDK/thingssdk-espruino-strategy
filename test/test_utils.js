'use strict';
const assert = require('chai').assert;
const utils = require('../utils');

describe('filterDevices', () => {
    it('keeps only espruino runtime', () => {
        let devices = {
          "port1": {"runtime": "espruino"},
          "port2": {"runtime": "kinoma"}
        };

        let results = utils.filterDevices(devices);

        assert.equal(results.length, 1);
    });

    it('creates a new object with port assigned', () => {
        let devices = {
          "port1": {"runtime": "espruino"}
        };

        let results = utils.filterDevices(devices);

        assert.equal(results[0].port, "port1");
    });
});