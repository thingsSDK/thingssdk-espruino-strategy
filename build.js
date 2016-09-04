/* Build file */
'use strict';

const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const json = require('rollup-plugin-json');

module.exports = function build(entry) {
    return done => {
        console.log("Treeshaking ES2015");
        rollup({
            entry,
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
            done(null, result.code);
        }).catch(done);
    };
};
