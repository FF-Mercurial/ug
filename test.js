'use strict';

let fs = require('fs'),
    path = require('path'),
    ug = require('./index'),
    srcFiles = ['utils.js', 'zepto.js', 'handlebars.js', 'page.js', 'scrat.js'].map((filename) => {
      return path.resolve('input', filename);
    });

// fs.writeFileSync('ast.json', JSON.stringify(require('esprima').parse(fs.readFileSync('src.js')), null, 2));
// ugFile('src.js', 'dst.js');

// srcFiles.forEach((srcFile) => {
  // console.log(srcFile);
  // let dstFile = path.resolve('output', 'ugly-' + path.basename(srcFile));
  // ugFile(srcFile, dstFile);
// });

function ugFile(srcFile, dstFile) {
  fs.writeFileSync(dstFile, ug(fs.readFileSync(srcFile)));
}

let dir = path.resolve(__dirname, process.argv[2]);
ugDirInplace(dir);

function ugDirInplace(dir) {
  (function walk(dir) {
      if (fs.statSync(dir).isFile()) {
        if (path.extname(dir) === '.js') {
          console.log(dir);
          ug.inplace(dir);
        }
      } else {
        for (let filename of fs.readdirSync(dir)) {
          let filepath = path.resolve(dir, filename);
          walk(filepath);
        }
      }
  })(dir);
}
