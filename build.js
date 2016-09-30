/* Build file */
'use strict';

const path = require('path');
const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const json = require('rollup-plugin-json');

module.exports = function build(devices, payload, next) {
    console.log("Treeshaking code...");
    rollup({
        entry: payload.entry,
        plugins: [
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
        bundle.write({
            format: 'cjs',
            dest: path.join(payload.buildDir, 'espruino-generated.js')
        }).then(next);
    }).catch(next);
};
