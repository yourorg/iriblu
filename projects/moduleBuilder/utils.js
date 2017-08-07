#!/usr/bin/env node
const shell = require('shelljs');
const fs = require('fs');
const render = require('es6-template-render');

const LG = console.log; // eslint-disable-line no-console,no-unused-vars

const values = require('./testsOnly/testData');

const transform = parms => {
  const data = parms.values;
  const file = parms.file;
  const origin = parms.origin;
  const destination = parms.destination;

  // LG( 'Will transform the file "%s" from "%s" with "%s" data writing to "%s".',
  //   file,
  //   origin,
  //   data,
  //   destination
  // );

  shell.mkdir('-p', destination);

  fs.readFile(origin + '/' + file, 'utf8',
    function (errR, tmplt) {
      if (errR) { throw errR; }
      fs.writeFile(
        destination + '/' + file,
        render(tmplt, data),
        function (errW) {
          if (errW) { throw errW; }
          LG('Written to "%s"', destination);
        });
    });
};

const test = () => {
  transform({
    values,
    file: 'testTmplt.js',
    origin: './testsOnly/',
    destination: './testsOnly/target',
  });
  return 'Trying ... ';
};

module.exports = {
  transform,
  test
};

require('make-runnable/custom')({
  printOutputFrame: false
});
