'use strict';

const sinon = require('sinon');
const assert = require('chai').assert;
const proxyquire = require('proxyquire');

const device = {'port': 'port1', 'runtime': 'espruino'};

describe("repl(device=)", () => {
    let repl;
    let utils;
    beforeEach(() => {
        utils = {
            'runEspruino': sinon.stub()
        };
        repl = proxyquire('../repl', {
            './utils': utils
        });
    });
    it('runs REPL using the espruino-cli', () => {
        repl(device);

        assert(utils.runEspruino.calledWith(device));
    });
});