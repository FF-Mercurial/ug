'use strict';

let fs = require('fs'),
    path = require('path'),
    ug = require('./index'),
    srcFiles = ['zepto.js', 'handlebars.js', 'page.js', 'scrat.js'].map((filename) => {
      return path.join('input', filename);
    });

srcFiles.forEach(function (srcFile) {
  let dstFile = path.join('output', 'ugly-' + path.basename(srcFile));
  fs.writeFileSync(dstFile, ug(fs.readFileSync(srcFile)));
});
