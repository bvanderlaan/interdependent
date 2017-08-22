'use string';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const lineReader = require('readline');
const sinon = require('sinon');

const findInterDependency = require('../lib/findInterDependency');

const expect = chai.expect;
chai.use(chaiAsPromised);


describe('Find Interdependency', () => {
  describe('when can not read file', () => {
    before(() => sinon.stub(fs, 'access').yields(new Error('boom')));
    after(() => fs.access.restore());

    it('should resolve null', () => (
      expect(findInterDependency('myFile'))
        .to.eventually.be.fulfilled
        .and.deep.equal({
          file: 'myFile',
          dependencies: null,
        })
    ));
  });

  describe('when can read file', () => {
    before(() => {
      sinon.stub(fs, 'access').yields();
      sinon.stub(fs, 'createReadStream');
    });
    after(() => {
      fs.access.restore();
      fs.createReadStream.restore();
    });

    describe('and line is not a require statement', () => {
      before(() => {
        const emitterStub = sinon.stub();
        emitterStub.withArgs('line').yields('I no import')

        emitterStub.withArgs('close').yields();
        sinon.stub(lineReader, 'createInterface').returns({
          on: emitterStub,
        });
      });
      after(() => lineReader.createInterface.restore());

      it('should resolve empty array', () => (
        expect(findInterDependency('lib/myModule.js'))
          .to.eventually.be.fulfilled
          .and.deep.equal({
            file: 'lib/myModule.js',
            dependencies: [],
          })
      ));
    });

    describe('and line is external dependency', () => {
      before(() => {
        const emitterStub = sinon.stub();
        emitterStub.withArgs('line').yields('const x = require(\'my-cool-mod\');');

        emitterStub.withArgs('close').yields();
        sinon.stub(lineReader, 'createInterface').returns({
          on: emitterStub,
        });
      });
      after(() => lineReader.createInterface.restore());

      it('should resolve empty array', () => (
        expect(findInterDependency('lib/myModule.js'))
          .to.eventually.be.fulfilled
          .and.deep.equal({
            file: 'lib/myModule.js',
            dependencies: [],
          })
      ));
    });

    describe('and line is internal dependency', () => {
      before(() => {
        const emitterStub = sinon.stub();
        emitterStub.withArgs('line').yields('const x = require(\'./my-cool-mod\');');

        emitterStub.withArgs('close').yields();
        sinon.stub(lineReader, 'createInterface').returns({
          on: emitterStub,
        });
      });
      after(() => lineReader.createInterface.restore());

      it('should resolve with array of internal dependencies', () => (
        expect(findInterDependency('lib/myModule.js'))
          .to.eventually.be.fulfilled
          .and.deep.equal({
            file: 'lib/myModule.js',
            dependencies: [
              'lib/my-cool-mod',
            ],
          })
      ));
    });

    describe('and line is internal dependency in different dir', () => {
      before(() => {
        const emitterStub = sinon.stub();
        emitterStub.withArgs('line').yields('const x = require(\'../my-cool-mod\');');

        emitterStub.withArgs('close').yields();
        sinon.stub(lineReader, 'createInterface').returns({
          on: emitterStub,
        });
      });
      after(() => lineReader.createInterface.restore());

      it('should resolve with array of internal dependencies', () => (
        expect(findInterDependency('lib/myMod/myModule.js'))
          .to.eventually.be.fulfilled
          .and.deep.equal({
            file: 'lib/myMod/myModule.js',
            dependencies: [
              'lib/my-cool-mod',
            ],
          })
      ));
    });
  });

});
