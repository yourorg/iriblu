'use strict';
// const { camelize, titleCase, spacedLower, noWhite } = require('./utils');
const { camelize, substitute, mapSubstitution, getPrimaryKeyColumn } = require('./utils');

const LG = console.log; // eslint-disable-line no-console,no-unused-vars

var mapReplace = {
  int: 'Int',
  varchar: 'String',
  char: 'String',
  datetime: 'Date',
  timestamp: 'Date',
};

  // .replace(/([A-Za-z]+)/g, function ( match, index) {  // eslint-disable-line no-unused-vars
  //   // LG( 'aType : ' + aType + ' --> +index : ' + index + ', match : ' + match + ' ==>> ' + ret );
  //   return mapReplace[match];
  // });

const mapType = aType => aType
  .replace(/([A-Za-z]+)/g, match => mapReplace[match])    // varchar(7) => String(7)
  .replace(/\(([^)]*)\)/g, () => '');                     // String(7) => String

// function htmlEscape(str) {
//   return str.replace(/&/g, '&amp;') // first!
//             .replace(/>/g, '&gt;')
//             .replace(/</g, '&lt;')
//             .replace(/"/g, '&quot;')
//             .replace(/'/g, '&#39;')
//             .replace(/`/g, '&#96;');
// }

// function substitute(templateObject, ...substitutions) {

//   // Use raw template strings: we don’t want
//   // backslashes (\n etc.) to be interpreted
//   const raw = templateObject.raw;

//   let result = '';

//   substitutions.forEach((substitution, i) => {
//     // Retrieve the template string preceding
//     // the current substitution
//     let lit = raw[i];
//     // LG('   lit -- ', raw[i]);
//     let subst = substitution;
//     // LG(' subst -- ', subst);

//     // In the example, map() returns an Array:
//     // If `subst` is an Array (and not a string),
//     // we turn it into a string
//     if (Array.isArray(subst)) {
//       subst = subst.join('');
//     }

//     // If the substitution is preceded by an exclamation
//     // mark, we escape special characters in it
//     if (lit.endsWith('!')) {
//       subst = htmlEscape(subst);
//       lit = lit.slice(0, -1);
//     }
//     result += lit;
//     result += subst;
//   });
//   // Take care of last template string
//   result += raw[raw.length - 1]; // (A)

//   return result;
// }

// function mapSubstitution( val, map ) {
//   var ret = map[val];
//   if ( typeof ret === 'undefined' ) { return val; }
//   return ret;
// }


/* eslint-disable max-len */
const modelAttributeTemplate = addrs =>
  substitute`${addrs.map(addr =>
substitute`
    !${camelize(addr.column_name)} : {
      type: !${mapType(addr.column_type)},
      allowNull: !${addr.is_nullable === 'NO' ? 'false' : 'true'},!${addr.column_key === 'PRI' ? '\n      primaryKey: true,' : ''}!${addr.extra ? addr.extra.match('auto_increment') ? '\n      autoIncrement: true,' : '' : ''}
      field: '!${addr.column_name}',
    },`)}`;

const queryCommentTemplate = ( addrs, queries ) => {
  return substitute`${addrs.map(addr => {
    if ( queries.noteCols.includes( addr.ordinal_position ) ) {
      return substitute`
    #        !${camelize(addr.column_name)}`;
    }
    return '';
  }
  )}`;
};

const querySpecificationTemplate = ( addrs, queries, nameMap ) => {
  return substitute`${addrs.map(addr => {
    if ( queries.cols.includes( addr.ordinal_position ) ) {
      return substitute`
      !${mapSubstitution(addr.column_name, nameMap)}: ${mapType(addr.column_type)},`;
    }
    return '';
  }
  )}`;
};

const createMutationTemplate = ( addrs, queries, nameMap ) => {
  return substitute`${addrs.map(addr => {
    if ( queries.cols.includes( addr.ordinal_position ) ) {
      return substitute`
      !${mapSubstitution(addr.column_name, nameMap)}: ${mapType(addr.column_type)},`;
    }
    return '';
  }
  )}`;
};
/* eslint-enable max-len */

function typeDefinitionTemplate( data, mods ) {
  LG('===================================================');
  LG(data);
  LG('===================================================');
  LG(mods.typeDef.queries.cols);
  LG('===================================================');
  var queries = mods.typeDef.queries;
  var nameMap = mods.sequelize.attributeNameMap;
  var typeDefs = `const Queries = \`
    ###  The items of the delivery note 'fkDelivery'.
    ####  Query example :
    #    {
    #      ${mods.alias.c}(${mapSubstitution(
              getPrimaryKeyColumn(data), nameMap)}: 1) {${queryCommentTemplate(data, queries)}
    #      }
    #    }
    ${mods.alias.c}(${querySpecificationTemplate(data, queries, nameMap)}
    ): [${mods.alias.u}]
\`;

const Mutations = \`
    create${mods.alias.u}( ${querySpecificationTemplate(data, queries, nameMap)}
      entrega_lines_id: Int!
      entrega_id: Int!
      cod: String!
    ): ${mods.alias.u}

    update${mods.alias.u}(
      _id: Int!
      entrega_lines_id: Int!
      entrega_id: Int!
      cod: String!
    ): ${mods.alias.u}

    hide${mods.alias.u}(
      _id: Int!
    ): ${mods.alias.u}
\`;

const Types = \`

    type ${mods.alias.u} {

      entrega_lines_id: Int
      entrega_id: Int
      cod: String
      createdAt: DateTime

    }
\`;


export default {
  qry: Queries,
  mut: Mutations,
  typ: Types
};
`;

  return typeDefs;
}


function typeDefinitionTemplateOld( data, mods ) {
  const sequelizeModel = `/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('tb${mods.alias.u}', {${modelAttributeTemplate(data)}
  }, {
    timestamps: false,
    tableName: '${data[0].table_name}'
  });
};
`;
  return sequelizeModel;
}

var XXX = 3;
var ret = ( XXX === 3 ) ? typeDefinitionTemplate : typeDefinitionTemplateOld;

exports.default = ret;
