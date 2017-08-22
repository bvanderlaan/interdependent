'use strict';

const fileLocator = require('../lib/fileLocator');
const findInterDependency = require('../lib/findInterDependency');
const { filterZeros, filterExcluded, sortDependencies, printDependency } = require('../lib/dependency');

module.exports = (path, program) => {
  if (program.nozero && program.onlyzero) {
    console.log('You can not use the --onlyZero and --noZero flags at the same time.')
    process.exit(-1);
  }

  const promises = fileLocator(path).map(file => findInterDependency(file));
  Promise.all(promises)
    .then((files) => {
      return files.filter(f => filterZeros(f, program))
        .filter(f => filterExcluded(f, program))
        .sort(sortDependencies);
    })
    .then((files) => {
      files.forEach(printDependency);
      console.log(`\nTotal number of files scanned: ${files.length}`);
    });
};