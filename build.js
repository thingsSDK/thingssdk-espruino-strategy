/* Build file */
'use strict';

const path = require('path');
const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const json = require('rollup-plugin-json');

function transformForEnvironment(env, entry) {
    return {
        transform(code, id) {
            const entryFullPath = path.join(__dirname, entry);
            if (entryFullPath === id) {
                if (env === "production") {
                    code = `${code};E.on("init", main);save();`;
                } else {
                    code = `${code};main();`;
                }
                return {
                    code,
                    map: { mappings: '' }
                }
            } else {
                return;
            }
        }
    }
}

module.exports = function build(devices, payload, next) {
    console.log("Treeshaking code...");
    rollup({
        entry: payload.entry,
        plugins: [
            transformForEnvironment(payload.env, payload.entry),
            json(),
            nodeResolve({
                main: true
            }),
            babel({
                presets: [
                    [
                        "es2015",
                        {
                            "modules": false
                        }
                    ]
                ],
                plugins: [
                    "external-helpers"
                ]
            })
        ]
    }).then(bundle => {
        console.log(bundle.code);
        return bundle.write({
            format: 'cjs',
            dest: path.join(payload.buildDir, 'espruino-generated.js')
        });
    }).then(() => next())
        .catch(next);
};
