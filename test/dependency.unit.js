'use string';

const { expect } = require('chai');

const dependency = require('../lib/dependency');

describe('Dependency', () => {
  describe('Filter Zeros', () => {
    describe(':: No Zeros ::', () => {
      it('should return false if \'nozero\' is true and dependencies is empty', () => {
        const file = {
          dependencies: [],
        };

        expect(dependency.filterZeros(file, { nozero: true }))
          .to.be.false;
      });

      it('should return true if \'nozero\' is true and dependencies is not empty', () => {
        const file = {
          dependencies: ['file1', 'file2'],
        };

        expect(dependency.filterZeros(file, { nozero: true }))
          .to.be.true;
      });

      it('should return true if \'nozero\' is false and dependencies is empty', () => {
        const file = {
          dependencies: [],
        };

        expect(dependency.filterZeros(file, { nozero: false }))
          .to.be.true;
      });

      it('should return true if \'nozero\' is false and dependencies is not empty', () => {
        const file = {
          dependencies: ['file1', 'file2'],
        };

        expect(dependency.filterZeros(file, { nozero: false }))
          .to.be.true;
      });
    });

    describe(':: Only Zeros ::', () => {
      it('should return true if \'onlyzero\' is true and dependencies is empty', () => {
        const file = {
          dependencies: [],
        };

        expect(dependency.filterZeros(file, { onlyzero: true }))
          .to.be.true;
      });

      it('should return false if \'onlyzero\' is true and dependencies is not empty', () => {
        const file = {
          dependencies: ['file1', 'file2'],
        };

        expect(dependency.filterZeros(file, { onlyzero: true }))
          .to.be.false;
      });

      it('should return true if \'onlyzero\' is false and dependencies is empty', () => {
        const file = {
          dependencies: [],
        };

        expect(dependency.filterZeros(file, { onlyzero: false }))
          .to.be.true;
      });

      it('should return true if \'onlyzero\' is false and dependencies is not empty', () => {
        const file = {
          dependencies: ['file1', 'file2'],
        };

        expect(dependency.filterZeros(file, { onlyzero: false }))
          .to.be.true;
      });
    });
  });

  describe('Filter Excluded', () => {
    it('should return true if \'exclude\' is undefined', () => {
      const file = {
        file: 'myFile.js',
      };
      expect(dependency.filterExcluded(file, { exclude: undefined }))
        .to.be.true;
    });

    it('should return true if \'exclude\' is empty', () => {
      const file = {
        file: 'myFile.js',
      };
      expect(dependency.filterExcluded(file, { exclude: [] }))
        .to.be.true;
    });

    it('should return false if file name or path is in the exclude list', () => {
      const file = {
        file: 'test/lib/myFile.js',
      };
      expect(dependency.filterExcluded(file, { exclude: ['test'] }))
        .to.be.false;
    });

    it('should return true if file name or path is not in the exclude list', () => {
      const file = {
        file: 'lib/myFile.js',
        dependencies: [],
      };
      expect(dependency.filterExcluded(file, { exclude: ['test'] }))
        .to.be.true;
    });

    it('should return false if one of the dependent files name or path is in the exclude list', () => {
      const file = {
        file: 'lib/myFile.js',
        dependencies: [
          'lib/otherFile.js',
          'test/otherFile.js',
        ],
      };
      expect(dependency.filterExcluded(file, { exclude: ['test'] }))
        .to.be.false;
    });

    it('should return true if none of the dependent files name or path is not in the exclude list', () => {
      const file = {
        file: 'lib/myFile.js',
        dependencies: [
          'lib/otherFile.js',
          'lib/otherOtherFile.js',
        ],
      };
      expect(dependency.filterExcluded(file, { exclude: ['test'] }))
        .to.be.true;
    });
  });

  describe('Sort Dependencies', () => {
    it('should return zero if both files have the same number of dependencies', () => {
      const fileOne = {
        dependencies: [
          'myCoolFile.js',
        ],
      };

      const fileTwo = {
        dependencies: [
          'lib/myCoolFile.js',
        ],
      };
      expect(dependency.sortDependencies(fileOne, fileTwo))
        .to.equal(0);
    });

    it('should return negative one if the left file has less dependencies then the right file', () => {
      const fileOne = {
        dependencies: [
          'myCoolFile.js',
        ],
      };

      const fileTwo = {
        dependencies: [
          'lib/myCoolFile.js',
          'lib/myOtherCoolFile.js',
        ],
      };
      expect(dependency.sortDependencies(fileOne, fileTwo))
        .to.equal(-1);
    });

    it('should return positive one if the left file has more dependencies then the right file', () => {
      const fileOne = {
        dependencies: [
          'myCoolFile.js',
          'lib/myOtherCoolFile.js',
        ],
      };

      const fileTwo = {
        dependencies: [
          'lib/myCoolFile.js',
        ],
      };
      expect(dependency.sortDependencies(fileOne, fileTwo))
        .to.equal(1);
    });
  });
});
