/* Build file */
'use strict';

const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const json = require('rollup-plugin-json');

module.exports = function build(devices, payload, done) {
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
        let result = bundle.generate({
            format: 'cjs'
        });
        payload.code = bundle.code;
        done();
    }).catch(done);
};
