# ug

a js obfuscator

## API

uglyJsCode = require('ug')(jsCode)

## test

no auto test suite, use test suites of several frontend libs instead.

passed following libs' __frontend__ test suites(NOTE: ug.js works only for browser end code)

to run the tests, clone the following repos and follow my guide

- require.js

    obfuscate 'require.js', then run tests following the README

- zepto.js

    obfuscate 'src/', then visit 'tests/index.html'

- underscore.js (npm test)
    
- backboone.js (npm test)

- vue.js (grunt casper)