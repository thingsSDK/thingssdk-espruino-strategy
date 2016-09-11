'use strict';

const assert = require('chai').assert;
const {build} = require('../index');
const path = require('path');
const esprima = require('esprima');

describe('build(devices, payload, next)', function () {
    describe('when entry is a valid source file', () => {
        const payload = { entry: path.join('test', 'examples', 'multi-level-include', 'index.js') };
        it('should return valid ES5 code', (done) => {
            build({}, payload, () => { 
                const expectedCode = `
                'use strict';
                function multiply(a, b) {
                    return a * b;
                }
                function square(a) {
                    return multiply(a, a);
                }
                var a = square(10);
                console.log(a);`;
                const tokens = esprima.tokenize(payload.code);
                const expectedTokens = esprima.tokenize(expectedCode);
                assert.deepEqual(tokens, expectedTokens, "Code generated did't match expected code");
                done();
            });
        });
    });

    describe('when entry is a valid source file with an imported json file', () => {
        const payload = { entry: path.join('test', 'examples', 'multi-level-include', 'json-include.js') };
        it('should return valid ES5 code', (done) => {
            build({}, payload, () => {
                const expectedCode = `
                'use strict';
                function divide(a, b) {
                    return a / b;
                }
                var val = 100;
                var a = divide(200, val);
                console.log(a);`;
                const tokens = esprima.tokenize(payload.code);
                const expectedTokens = esprima.tokenize(expectedCode);
                assert.deepEqual(tokens, expectedTokens, "Code generated did't match expected code");
                done();
            });
        });
    });

    describe('when entry is a invalid source file', () => {
        const payload = { entry: path.join('test', 'examples', 'invalid-code', 'index.js') };

        it('should error', (done) => {
            build({}, payload, (err) => {
                assert.isNotNull(err);
                assert.equal(payload.code, undefined);
                done();
            });
        });
    });

    describe('when entry\'s import cannot be resolved', () => {
        const payload = { entry: path.join('test', 'examples', 'invalid-code', 'unresolved.js') };
        it('should throw an error', (done) => {
            build({}, payload, (err) => {
                assert.isNotNull(err);
                assert.equal(payload.code, undefined);
                done();
            });
        });
    });

    describe('when entry is an invalid path file', () => {
        it('should error', (done) => {
            const payload = { entry: path.join('test', 'examples', 'invalid-code', 'doesnt-exist.js') };
            build({}, payload, (err) => {
                assert.isNotNull(err);
                assert.equal(payload.code, undefined);
                done();
            });
        });
    });
});