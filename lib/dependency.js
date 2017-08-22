'use strict';

module.exports = {
  filterZeros(file, program) {
    if (program.nozero) {
      return file.dependencies.length > 0
    } else if (program.onlyzero) {
      return file.dependencies.length === 0
    } else {
      return true;
    }
  },

  filterExcluded(f, program) {
    if (program.exclude) {
      return !program.exclude.some(e => f.file.includes(e))
        && !program.exclude.some(e => f.dependencies.some(dep => dep.includes(e)));
    }

    return true;
  },

  sortDependencies(l, r) {
    if (l.dependencies.length === r.dependencies.length) {
      return 0;
    } else if (l.dependencies.length < r.dependencies.length) {
      return -1;
    }
    return 1;
  },

  printDependency(f) {
    console.log(`\n${f.file} ${f.dependencies.length}`);
    f.dependencies.forEach(dep => console.log(`\t+ ${dep}`));
  }
};
