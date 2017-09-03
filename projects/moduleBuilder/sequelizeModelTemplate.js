'use strict';
// const { camelize, titleCase, spacedLower, noWhite } = require('./utils');
const { mapDataType, mapSubstitution } = require('./utils');

const LG = console.log; // eslint-disable-line no-console,no-unused-vars

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


function isNullable(addr, mods) {
  let specified = mods.sequelize.attrAdaptationMap[addr.column_name].null;
  if ( specified ) return specified;
  return addr.is_nullable === 'NO' ? 'false' : 'true';
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
    ${mapSubstitution( addr.column_name, mods.sequelize.attrAdaptationMap, 'orm' )}: {
      type: ${mapDataType(addr.column_type)},
      allowNull: ${isNullable(addr, mods)},!${addr.column_key === 'PRI' ?
        '\n      primaryKey: true,' :
        ''}!${addr.extra ?
          addr.extra.match('auto_increment') ?
          '\n      autoIncrement: true,' :
          '' :
          ''}
      field: '${mapSubstitution( addr.column_name, mods.sequelize.attrAdaptationMap, 'db' )}',
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

  return ${mods.alias.u};
};
`;

  return sequelizeModel;
}

exports.default = sequelizeModelTemplate;
