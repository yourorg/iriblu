'use strict';

const LG = console.log; // eslint-disable-line no-console,no-unused-vars

function camelize(str) {
  return str
    .replace(/_+/g, ' ')
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
    .replace(/\s+/g, '');
}

var mapPartialReplace = {
  int: 'DataTypes.INTEGER',
  varchar: 'DataTypes.STRING',
  char: 'DataTypes.CHAR',
  datetime: 'DataTypes.DATE',
};

var mapFullReplace = {
  timestamp: 'TIMESTAMP',
};

function mapType(aType) {
  var rgx = '';
  rgx = aType
  .replace(/(?:[A-Za-z]+)/g, function ( match, index) {  // eslint-disable-line no-unused-vars
    LG( 'index : ' + index + ', match : ' + match );
    return mapPartialReplace[match];
  });
  LG( ' GOT "%s".', rgx );
  if ( rgx === 'undefined' ) {

    rgx = aType
    .replace(/([A-Za-z]+)/g, function ( match, index) {  // eslint-disable-line no-unused-vars
      LG( 'index : ' + index + ', match : ' + match );
      return mapFullReplace[match];
    });
  }
  return rgx;
}

function htmlEscape(str) {
  return str.replace(/&/g, '&amp;') // first!
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/`/g, '&#96;');
}

function html(templateObject, ...substitutions) {

  // Use raw template strings: we don’t want
  // backslashes (\n etc.) to be interpreted
  const raw = templateObject.raw;

  let result = '';

  substitutions.forEach((substitution, i) => {
    // Retrieve the template string preceding
    // the current substitution
    let lit = raw[i];
    let subst = substitution;
    // console.log(" lit ", lit)

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

/* eslint-disable max-len */
const tmpl = addrs =>
  html`${addrs.map(addr =>
html`
    !${camelize(addr.column_name)}: {
      type: !${mapType(addr.column_type)},
      allowNull: !${addr.is_nullable === 'NO' ? 'false' : 'true'},!${addr.column_key === 'PRI' ? '\n      primaryKey: true,' : ''}!${addr.extra ? addr.extra.match('auto_increment') ? '\n      autoIncrement: true,' : '' : ''}
      field: '!${addr.column_name}',
    },`)}`;
/* eslint-enable max-len */

exports.default = function ( data, mods ) {

  const sequelizeModel = `/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('tb${mods.alias.u}', {${tmpl(data)}
  }, {
    timestamps: false,
    tableName: '${data[0].table_name}'
  });
};
`;

  return sequelizeModel;
};
