'use string';

const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const sinon = require('sinon');

const fileLocator = require('../lib/fileLocator');


describe('File Locator', () => {
  before(() => sinon.stub(path, 'resolve').returnsArg(0))
  after(() => path.resolve.restore());

  describe('when path is a file', () => {
    before(() => {
      sinon.stub(fs, 'statSync').returns({
        isDirectory() { return false; }
      });
    });
    after(() => fs.statSync.restore());

    it('should return the file as an array', () => {
      expect(fileLocator('myFile.js'))
        .to.be.an('array')
        .which.deep.equals([
          'myFile.js',
        ]);
    });
  });

  describe('when path is a directory', () => {
    before(() => {
      sinon.stub(fs, 'statSync').returns({
        isDirectory() { return false; }
      }).onFirstCall().returns({
        isDirectory() { return true; }
      }).onThirdCall().returns({
        isDirectory() { return true; }
      });
      sinon.stub(fs, 'readdirSync').returns([
        'myFile1.js',
        'myFile2.js',
        'myFile3.js',
        'myFile4.js',
      ]).onFirstCall().returns([
        'myFile1.js',
        'myFile2',
        'myFile3.js',
        'myFile4.js',
      ]);
    });
    after(() => {
      fs.statSync.restore();
      fs.readdirSync.restore();
    });

    it('should return an array of all the files under the path', () => {
      expect(fileLocator('myFiles'))
        .to.be.an('array')
        .which.deep.equals([
          'myFiles/myFile1.js',
          'myFiles/myFile2/myFile1.js',
          'myFiles/myFile2/myFile2.js',
          'myFiles/myFile2/myFile3.js',
          'myFiles/myFile2/myFile4.js',
          'myFiles/myFile3.js',
          'myFiles/myFile4.js',
        ]);
    });
  });

  describe('when path is a directory will filter node_modules', () => {
    before(() => {
      sinon.stub(fs, 'statSync').returns({
        isDirectory() { return false; }
      }).onFirstCall().returns({
        isDirectory() { return true; }
      }).onThirdCall().returns({
        isDirectory() { return true; }
      });
      sinon.stub(fs, 'readdirSync').returns([
        'myFile1.js',
        'myFile2.js',
        'myFile3.js',
        'myFile4.js',
      ]).onFirstCall().returns([
        'myFile1.js',
        'myFile2',
        'myFile3.js',
        'myFile4.js',
        'node_modules',
      ]);
    });
    after(() => {
      fs.statSync.restore();
      fs.readdirSync.restore();
    });

    it('should return an array of all the files under the path', () => {
      expect(fileLocator('myFiles'))
        .to.be.an('array')
        .which.deep.equals([
          'myFiles/myFile1.js',
          'myFiles/myFile2/myFile1.js',
          'myFiles/myFile2/myFile2.js',
          'myFiles/myFile2/myFile3.js',
          'myFiles/myFile2/myFile4.js',
          'myFiles/myFile3.js',
          'myFiles/myFile4.js',
        ]);
    });
  });

  describe('when path is a directory will filter non-JS files', () => {
    before(() => {
      sinon.stub(fs, 'statSync').returns({
        isDirectory() { return false; }
      }).onFirstCall().returns({
        isDirectory() { return true; }
      }).onThirdCall().returns({
        isDirectory() { return true; }
      });
      sinon.stub(fs, 'readdirSync').returns([
        'myFile1.js',
        'myFile2.js',
        'myFile3.js',
        'myFile4.js',
      ]).onFirstCall().returns([
        'myFile1.js',
        'myFile2',
        'myFile3.js',
        'myFile4.js',
        'myFile5.rb',
      ]);
    });
    after(() => {
      fs.statSync.restore();
      fs.readdirSync.restore();
    });

    it('should return an array of all the files under the path', () => {
      expect(fileLocator('myFiles'))
        .to.be.an('array')
        .which.deep.equals([
          'myFiles/myFile1.js',
          'myFiles/myFile2/myFile1.js',
          'myFiles/myFile2/myFile2.js',
          'myFiles/myFile2/myFile3.js',
          'myFiles/myFile2/myFile4.js',
          'myFiles/myFile3.js',
          'myFiles/myFile4.js',
        ]);
    });
  });
});
