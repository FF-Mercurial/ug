'use strict';

var fs = require('fs'),
    path = require('path'),
    ug = require('./index');


function ugFile(srcFile, dstFile) {
  fs.writeFileSync(dstFile, ug(fs.readFileSync(srcFile)));
}

if (process.argv[2]) {
  var dir = path.resolve('.', process.argv[2]);
  ugDirInplace(dir);
} else {
  ugFile('tmp.js', 'out.js');
}

function ugDirInplace(dir) {
  (function walk(dir) {
      if (fs.statSync(dir).isFile()) {
        if (path.extname(dir) === '.js') {
          console.log(dir);
          ug.inplace(dir);
        }
      } else {
        fs.readdirSync(dir).forEach(function (filename) {
          var filepath = path.resolve(dir, filename);
          walk(filepath);
        });
      }
  })(dir);
}