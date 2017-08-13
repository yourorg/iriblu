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
          // LG('Written to "%s"', destination);
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

const camelize = str =>
  str
  .replace(
    /(?:^\w|[A-Z]|\b\w)/g,
    (letter, index) => {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
  .replace(/\s+/g, '');

const titleCase = str =>
  str
  .replace(
    /(?:^\w|[A-Z]|\b\w)/g,
    letter => letter.toUpperCase()
  );

const spacedLower = text => text.replace(/_/g , ' ');
const noWhite = text => text.replace(/ /g , '');

function htmlEscape(str) {
  return str.replace(/&/g, '&amp;') // first!
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/`/g, '&#96;');
}

function substitute(templateObject, ...substitutions) {

  // Use raw template strings: we don’t want
  // backslashes (\n etc.) to be interpreted
  const raw = templateObject.raw;

  let result = '';

  substitutions.forEach((substitution, i) => {
    // Retrieve the template string preceding
    // the current substitution
    let lit = raw[i];
    // LG('   lit -- ', raw[i]);
    let subst = substitution;
    // LG(' subst -- ', subst);

    // In the example, map() returns an Array:
    // If `subst` is an Array (and not a string),
    // we turn it into a string
    if (Array.isArray(subst)) {
      subst = subst.join('');
    }

    // If the substitution is preceded by an exclamation
    // mark, we escape special characters in it
    if (lit.endsWith('!')) {
      subst = htmlEscape(subst);
      lit = lit.slice(0, -1);
    }
    result += lit;
    result += subst;
  });
  // Take care of last template string
  result += raw[raw.length - 1]; // (A)

  return result;
}


var mapPartialReplace = {
  int: 'DataTypes.INTEGER',
  varchar: 'DataTypes.STRING',
  char: 'DataTypes.CHAR',
  datetime: 'DataTypes.DATE',
};

var mapFullReplace = {
  timestamp: `'TIMESTAMP'`,
};

function mapDataType(aType) {
  var rgx = '';
  rgx = aType
  .replace(/(?:[A-Za-z]+)/g, function ( match, index) {  // eslint-disable-line no-unused-vars
    // LG( 'index : ' + index + ', match : ' + match );
    return mapPartialReplace[match];
  });
  // LG( ' GOT "%s".', rgx );
  if ( rgx === 'undefined' ) {

    rgx = aType
    .replace(/([A-Za-z]+)/g, function ( match, index) {  // eslint-disable-line no-unused-vars
      // LG( 'index : ' + index + ', match : ' + match );
      return mapFullReplace[match];
    });
  }
  return rgx;
}

const getPrimaryKeyColumn = attributes => attributes
  .filter( attribute => attribute.column_key === 'PRI')[0].column_name;

function mapSubstitution( val, map ) {
  var ret = map[val];
  if ( typeof ret === 'undefined' ) { return val; }
  return ret;
}


module.exports = {
  transform,
  substitute,
  camelize,
  titleCase,
  spacedLower,
  noWhite,
  mapDataType,
  mapSubstitution,
  getPrimaryKeyColumn,
  test
};

require('make-runnable/custom')({
  printOutputFrame: false
});
