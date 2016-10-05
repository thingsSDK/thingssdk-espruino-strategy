'use strict';

const assert = require('chai').assert;
const mockSpawn = require('mock-spawn');
const proxyquire = require('proxyquire');
const utils = require('../utils');
describe('filterDevices(devices)', () => {


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

describe('runEspruino(device, ...cmdLineArgs)', () => {
    let mockedUtils;
    let mockedSpawn;
    let device = {
        "port": "port1",
        "runtime": "espruino",
        "baud_rate": "9600"
    };

    beforeEach(() => {
        mockedSpawn = mockSpawn();
        mockedUtils = proxyquire('../utils', {
            'child_process': {'spawn': mockedSpawn}
        });
    });

    it('spawns a new espruino-cli with no args', () => {
        mockedUtils.runEspruino(device);

        assert.equal(mockedSpawn.calls.length, 1);
        let call = mockedSpawn.calls[0];
        assert.equal(call.command, 'node', "node is called");
        // String contains (avoiding path probs in test)
        assert.include(call.args[0], 'espruino-cli', "espruino-cli script is called");
        assert.include(call.args, "9600", "baud rate is passed");
        assert.include(call.args, "port1", "port is passed");
    });

    it('spawns with additional params', () => {
        mockedUtils.runEspruino(device, 'p1', 'p2');

        let args = mockedSpawn.calls[0].args;
        assert.include(args, 'p1');
        assert.include(args, 'p2');
    });
});