'use strict';
const sinon = require('sinon');
const assert = require('chai').assert;
const path = require('path');
const proxyquire = require('proxyquire');

describe("upload(devices, payload, next)", () => {
    const devices = {
        "port1": {"runtime": "espruino"}
    };
    const payload = {
        'buildDir': path.join('some', 'dir')
    };
    let upload;
    let utils;
    beforeEach(() => {
        utils = {
            'runEspruino': sinon.stub()
        };
        upload = proxyquire('../upload', {
            './utils': utils
        });
    });
    it('uploads using the espruino-cli', () => {
        let next = sinon.spy();
        upload(devices, payload, next);

        let expectedPath = path.join(payload.buildDir, 'espruino-generated.js');
        assert(utils.runEspruino.calledWith(
            {'port': 'port1', 'runtime': 'espruino'},
            '-c',
            expectedPath
        ));
        assert(next.calledOnce);
    });
});