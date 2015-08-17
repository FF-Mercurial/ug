'use strict';

let parse = require('esprima').parse,
    gen = require('escodegen').generate,
    uglify = require('uglify-js').minify,
    ug = require('./ug');

function fromStr(srcStr) {
  let srcAst = parse(srcStr),
      outAst = ug(srcAst),
      out = gen(outAst, { format: { indent: { style: '  ' } } });
  return uglify(out, { fromString: true }).code;
}

module.exports = fromStr;
