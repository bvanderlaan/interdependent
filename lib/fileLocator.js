'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function buildDirTree(p) {
  const absPath = path.resolve(p);

  const stat = fs.statSync(absPath);
  if (stat.isDirectory()) {
    let paths = [];

    fs.readdirSync(absPath).forEach(file => {
      if (file !== 'node_modules') {
        paths = paths.concat(buildDirTree(path.join(absPath, file)));
      }
    });

    return paths;
  } else {
    if (path.extname(absPath) === '.js') {
      return [absPath];
    }
    return [];
  }
};
