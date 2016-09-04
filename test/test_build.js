'use strict';

const assert = require('chai').assert;
const {build} = require('../index');
const path = require('path');
const esprima = require('esprima');

describe('build(entry)', function () {
    describe('when entry is a valid source file', () => {
        it('should return valid ES5 code', (done) => {
            build(path.join('test', 'examples', 'multi-level-include', 'index.js'))((err, code) => {
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
                const tokens = esprima.tokenize(code);
                const expectedTokens = esprima.tokenize(expectedCode);
                assert.deepEqual(tokens, expectedTokens, "Code generated did't match expected code");
                done();
            });
        });
    });

    describe('when entry is a valid source file with an imported json file', () => {
        it('should return valid ES5 code', (done) => {
            build(path.join('test', 'examples', 'multi-level-include', 'json-include.js'))((err, code) => {
                const expectedCode = `
                'use strict';
                function divide(a, b) {
                    return a / b;
                }
                var val = 100;
                var a = divide(200, val);
                console.log(a);`;
                const tokens = esprima.tokenize(code);
                const expectedTokens = esprima.tokenize(expectedCode);
                assert.deepEqual(tokens, expectedTokens, "Code generated did't match expected code");
                done();
            });
        });
    });

    describe('when entry is a invalid source file', () => {
        it('should error', (done) => {
            build(path.join('test', 'examples', 'invalid-code', 'index.js'))((err, code) => {
                assert.isNotNull(err);
                assert.equal(code, undefined);
                done();
            });
        });
    });

    describe('when entry\'s import cannot be resolved', () => {
        it('should throw an error', (done) => {
            build(path.join('test', 'examples', 'invalid-code', 'unresolved.js'))((err, code) => {
                assert.isNotNull(err);
                assert.equal(code, undefined);
                done();
            });
        });
    });

    describe('when entry is an invalid path file', () => {
        it('should error', () => {
            build(path.join('test', 'examples', 'invalid-code', 'doesnt-exist.js'))((err, code) => {
                assert.isNotNull(err);
                assert.equal(code, undefined);
                done();
            });
        });
    });
});