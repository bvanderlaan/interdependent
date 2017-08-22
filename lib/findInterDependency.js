'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const lineReader = require('readline');
const path = require('path');

function canRead(file) {
    return fs.accessAsync(file, fs.constants.R_OK);
};

module.exports = (file) => {
  return canRead(file)
    .then(() => {
      return new Promise((resolve) => {
        const reader = lineReader.createInterface({
          input: fs.createReadStream(file),
        });
        const dependencies = [];

        reader.on('line', (line) => {
          const results = /require\('(\.+\/.+)'\)/.exec(line)

          if (results) {
            dependencies.push(path.join(path.dirname(file), results[1]));
          }
        });

        reader.on('close', () => resolve({ file, dependencies }));
      });
    })
    .catch(() => ({
      file,
      dependencies: null,
    }));
};