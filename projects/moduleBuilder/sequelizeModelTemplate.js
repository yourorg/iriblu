'use strict';
// const { camelize, titleCase, spacedLower, noWhite } = require('./utils');
const { mapDataType, mapSubstitution } = require('./utils');

const LG = console.log; // eslint-disable-line no-console,no-unused-vars

// var mapPartialReplace = {
//   int: 'DataTypes.INTEGER',
//   varchar: 'DataTypes.STRING',
//   char: 'DataTypes.CHAR',
//   datetime: 'DataTypes.DATE',
// };

// var mapFullReplace = {
//   timestamp: `'TIMESTAMP'`,
// };

// function mapDataType(aType) {
//   var rgx = '';
//   rgx = aType
//   .replace(/(?:[A-Za-z]+)/g, function ( match, index) {  // eslint-disable-line no-unused-vars
//     // LG( 'index : ' + index + ', match : ' + match );
//     return mapPartialReplace[match];
//   });
//   // LG( ' GOT "%s".', rgx );
//   if ( rgx === 'undefined' ) {

//     rgx = aType
//     .replace(/([A-Za-z]+)/g, function ( match, index) {  // eslint-disable-line no-unused-vars
//       // LG( 'index : ' + index + ', match : ' + match );
//       return mapFullReplace[match];
//     });
//   }
//   return rgx;
// }

function htmlEscape(str) {
  return str.replace(/&/g, '&amp;') // first!
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/`/g, '&#96;');
}

function xfrm(templateObject, ...substitutions) {

  // Use raw template strings: we don’t want
  // backslashes (\n etc.) to be interpreted
  const raw = templateObject.raw;

  let result = '';

  substitutions.forEach((substitution, i) => {
    // Retrieve the template string preceding
    // the current substitution
    let lit = raw[i];
//    LG('   lit -- ', raw[i]);
    let subst = substitution;
//    LG(' subst -- ', subst);
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

// function mapSubstitute( val, map ) {
//   var ret = map[val];
//   if ( typeof ret === 'undefined' ) { return val; }
//   return ret;
// }

/* eslint-disable max-len */
const modelAttributeTemplate = (addrs, mods) =>
  xfrm`${addrs.map(addr =>
xfrm`
    ${mapSubstitution( addr.column_name, mods.sequelize.attributeNameMap, 'orm' )}: {
      type: ${mapDataType(addr.column_type)},
      allowNull: !${addr.is_nullable === 'NO' ?
        'false' :
        'true'},!${addr.column_key === 'PRI' ?
        '\n      primaryKey: true,' :
        ''}!${addr.extra ?
          addr.extra.match('auto_increment') ?
          '\n      autoIncrement: true,' :
          '' :
          ''}
      field: '${mapSubstitution( addr.column_name, mods.sequelize.attributeNameMap, 'db' )}',
      comment: '!${addr.column_name}',
    },`)}`;
/* eslint-enable max-len */

function sequelizeModelTemplate( data, mods ) {
  const sequelizeModel = `const LG = console.log; // eslint-disable-line no-console,no-unused-vars

const Instance = '${mods.alias.u}';
const Table = '${mods.alias.o}';

module.exports = function (sequelize, DataTypes) {
  let ${mods.alias.u} = sequelize.define(Instance, {${modelAttributeTemplate(data, mods)}
  }, {
    tableName: Table,
    timestamps: true,
    paranoid: true,
  });

  return DeliveryItem;
};
`;

  return sequelizeModel;
}

exports.default = sequelizeModelTemplate;
