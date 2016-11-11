'use strict';

const fs = require('fs');
const assert = require('chai').assert;
const {build} = require('../index');
const esprima = require('esprima');
const path = require('path');
const tmp = require('tmp');

tmp.setGracefulCleanup();

function getTmpDir() {
    let tmpObj = tmp.dirSync({ unsafeCleanup: true });
    return tmpObj.name;
}

function assertBuildsSuccessfully(pathToEntry, expectedCode, env, done) {
    let buildDir = getTmpDir();
    let payload = {
        entry: pathToEntry,
        buildDir,
        env
    };
    build({}, payload, () => {
        let generated = fs.readFileSync(path.join(payload.buildDir, 'espruino-generated.js')).toString();
        const tokens = esprima.tokenize(generated);
        const expectedTokens = esprima.tokenize(expectedCode);
        assert.deepEqual(tokens, expectedTokens, 'Generated code matches tokens');
        done();
    });
}

function assertBuildFails(pathToEntry, done) {
    let buildDir = getTmpDir();
    let payload = {
        entry: pathToEntry,
        buildDir,
        env: "development"
    };
    build({}, payload, (err) => {
        assert.isNotNull(err);
        let fileCount = fs.readdirSync(buildDir).length;
        // No file created
        assert.equal(fileCount, 0);
        done();
    });
}

describe('build(devices, payload, next)', () => {
    describe("development mode", () => {
        describe('when entry is a valid source file', () => {
            it('should return valid ES5 code', done => {
                const pathToEntry = path.join('test', 'examples', 'multi-level-include', 'index.js');
                const expectedCode = `
                    'use strict';
                    function multiply(a, b) {
                        return a * b;
                    }
                    function square(a) {
                        return multiply(a, a);
                    }
                    var a = square(10);
                    function main(){
                        console.log(a);
                    };
                    main();`;
                assertBuildsSuccessfully(pathToEntry, expectedCode, "development", done);
            });
        });

        describe('when entry is a valid source file with an imported json file', () => {
            it('should return valid ES5 code', done => {
                const pathToEntry = path.join('test', 'examples', 'multi-level-include', 'json-include.js');
                const expectedCode = `
                    'use strict';
                    function divide(a, b) {
                        return a / b;
                    }
                    var val = 100;
                    var a = divide(200, val);
                    function main() {
                        console.log(a);
                    };
                    main();`;
                assertBuildsSuccessfully(pathToEntry, expectedCode, "development", done);
            });
        });
    });

    describe("production mode", () => {
        describe('when entry is a valid source file', () => {
            it('should return valid ES5 code', done => {
                const pathToEntry = path.join('test', 'examples', 'multi-level-include', 'index.js');
                const expectedCode = `
                    'use strict';
                    function multiply(a, b) {
                        return a * b;
                    }
                    function square(a) {
                        return multiply(a, a);
                    }
                    var a = square(10);
                    function main(){
                        console.log(a);
                    };
                    E.on("init", main); save();`;
                assertBuildsSuccessfully(pathToEntry, expectedCode, "production", done);
            });
        });

        describe('when entry is a valid source file with an imported json file', () => {
            it('should return valid ES5 code', done => {
                const pathToEntry = path.join('test', 'examples', 'multi-level-include', 'json-include.js');
                const expectedCode = `
                    'use strict';
                    function divide(a, b) {
                        return a / b;
                    }
                    var val = 100;
                    var a = divide(200, val);
                    function main() {
                        console.log(a);
                    };
                    E.on("init", main); save();`;
                assertBuildsSuccessfully(pathToEntry, expectedCode, "production", done);
            });
        });
    });

    describe('when entry is a invalid source file', () => {
        let pathToEntry = path.join('test', 'examples', 'invalid-code', 'index.js');

        it('should error', (done) => {
            let pathToEntry = path.join('test', 'examples', 'invalid-code', 'index.js');
            assertBuildFails(pathToEntry, done);
        });
    });

    describe('when entry\'s import cannot be resolved', () => {
        it('should throw an error', (done) => {
            let pathToEntry = path.join('test', 'examples', 'invalid-code', 'unresolved.js');
            assertBuildFails(pathToEntry, done);
        });
    });

    describe('when entry is an invalid path file', () => {
        it('should error', (done) => {
            let pathToEntry = path.join('test', 'examples', 'invalid-code', 'doesnt-exist.js');
            assertBuildFails(pathToEntry, done);
        });
    });
});