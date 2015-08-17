'use strict';

let parse = require('esprima').parse,
    gen = require('escodegen').generate,
    uglify = require('uglify-js').minify,
    fs = require('fs'),
    ug = require('./ug');

function fromStr(srcStr) {
  let srcAst = parse(srcStr),
      outAst = ug(srcAst),
      out = gen(outAst, { format: { indent: { style: '  ' } } });
  return out;
  return uglify(out, { fromString: true }).code;
}

fromStr.inplace = (file) => {
  fs.writeFileSync(file, fromStr(fs.readFileSync(file)));
};

module.exports = fromStr;
