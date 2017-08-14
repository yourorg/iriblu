'use strict';
// const { camelize, titleCase, spacedLower, noWhite } = require('./utils');
const { camelize, substitute, mapSubstitution, getPrimaryKeyColumn } = require('./utils');

const LG = console.log; // eslint-disable-line no-console,no-unused-vars

var mapReplace = {
  int: 'Int',
  varchar: 'String',
  char: 'String',
  datetime: 'Date',
  timestamp: 'DateTime',
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
// const modelAttributeTemplate = attrs =>
//   substitute`${attrs.map(attr =>
// substitute`
//     !${camelize(attr.column_name)} : {
//       type: !${mapType(attr.column_type)},
//       allowNull: !${attr.is_nullable === 'NO' ? 'false' : 'true'},!${attr.column_key === 'PRI' ? '\n      primaryKey: true,' : ''}!${attr.extra ? attr.extra.match('auto_increment') ? '\n      autoIncrement: true,' : '' : ''}
//       field: '!${attr.column_name}',
//     },`)}`;

const dataTypeTemplate = ( attrs, queries, nameMap ) => {
  return substitute`${attrs.map(attr => {
    if ( queries.cols.includes( attr.ordinal_position ) ) {
      return substitute`
      !${mapSubstitution(attr.column_name, nameMap, 'orm')}: ${mapType(attr.column_type)}`;
    }
    return '';
  }
  )}`;
};

const querySpecificationTemplate = ( attrs, queries, nameMap ) => {
  return substitute`${attrs.map(attr => {
    if ( queries.cols.includes( attr.ordinal_position ) ) {
      return substitute`
      !${mapSubstitution(attr.column_name, nameMap, 'orm')}: ${mapType(attr.column_type)},`;
    }
    return '';
  }
  )}`;
};

const queryCommentTemplate = ( attrs, queries, nameMap ) => {
  return substitute`${attrs.map(attr => {
    if ( queries.noteCols.includes( attr.ordinal_position ) ) {
      return substitute`
    #        !${mapSubstitution(camelize(attr.column_name), nameMap, 'orm')}`;
    }
    return '';
  }
  )}`;
};


const mutCreateArgsTemplate = ( attrs, mutations, nameMap ) => {
  let spc = '';
  let arg = ``;
  return substitute`${attrs.map(attr => {
    if ( mutations.colsCreate.includes( attr.ordinal_position ) ) {
      arg = substitute`${spc}$!${mapSubstitution(attr.column_name, nameMap, 'orm')}:` +
                       ` ${mapType(attr.column_type)}` +
                       `${attr.is_nullable === 'NO' ? '!' : ''}`;
      spc = ', ';
      return arg;
    }
    return '';
  }
  )}`;
};

const mutCreateCallTemplate = ( attrs, mutations, nameMap ) => {
  let spc = '';
  let arg = ``;
  return substitute`${attrs.map(attr => {
    if ( mutations.colsCreate.includes( attr.ordinal_position ) ) {
      arg = substitute`${spc}${mapSubstitution(attr.column_name, nameMap, 'orm')}:` +
                       ` $${mapSubstitution(attr.column_name, nameMap, 'orm')}`;
      spc = ', ';
      return arg;
    }
    return '';
  }
  )}`;
};

const mutCreateRespTemplate = ( attrs, mutations, nameMap ) => {
  return substitute`${attrs.map(attr => {
    if ( mutations.colsCreateRsvp.includes( attr.ordinal_position ) ) {
      return substitute`
  #        !${mapSubstitution(attr.column_name, nameMap, 'orm')}`;
    }
    return '';
  }
  )}`;
};

const mutCreateVarsTemplate = ( attrs, mutations, nameMap ) => {
  let idx = 0;
  return substitute`${attrs.map(attr => {
    if ( mutations.colsCreate.includes( attr.ordinal_position ) ) {
      return substitute`
  #       "!${mapSubstitution(attr.column_name, nameMap, 'orm')}":` +
` ${mutations.colsCreateVar[idx++]},`;
    }
    return '';
  }
  )}`;
};

const mutCreateMethodTemplate = ( attrs, mutations, nameMap ) => {
  return substitute`${attrs.map(attr => {
    if ( mutations.colsCreate.includes( attr.ordinal_position ) ) {
      return substitute`
    !${mapSubstitution(attr.column_name, nameMap, 'orm')}:` +
       ` ${mapType(attr.column_type)}${attr.is_nullable === 'NO' ? '!' : ''}`;
    }
    return '';
  }
  )}`;
};

const mutHideVarsTemplate = ( attrs, mutations, nameMap ) => {
  let idx = 0;
  return substitute`${attrs.map(attr => {
    if ( mutations.colsHide.includes( attr.ordinal_position ) ) {
      return substitute`
  #       "!${mapSubstitution(attr.column_name, nameMap, 'orm')}":` +
` ${mutations.colsHideVar[idx++]},`;
    }
    return '';
  }
  )}`;
};

const mutUpdateArgsTemplate = ( attrs, mutations, nameMap ) => {
  let spc = '';
  let arg = ``;
  return substitute`${attrs.map(attr => {
    if ( mutations.colsUpdate.includes( attr.ordinal_position ) ) {
      arg = substitute`${spc}$!${mapSubstitution(attr.column_name, nameMap, 'orm')}:` +
                       ` ${mapType(attr.column_type)}` +
                       `${attr.is_nullable === 'NO' ? '!' : ''}`;
      spc = ', ';
      return arg;
    }
    return '';
  }
  )}`;
};

const mutUpdateCallTemplate = ( attrs, mutations, nameMap ) => {
  let spc = '';
  let arg = ``;
  return substitute`${attrs.map(attr => {
    if ( mutations.colsUpdate.includes( attr.ordinal_position ) ) {
      arg = substitute`${spc}${mapSubstitution(attr.column_name, nameMap, 'orm')}:` +
                       ` $${mapSubstitution(attr.column_name, nameMap, 'orm')}`;
      spc = ', ';
      return arg;
    }
    return '';
  }
  )}`;
};

const mutUpdateRespTemplate = ( attrs, mutations, nameMap ) => {
  return substitute`${attrs.map(attr => {
    if ( mutations.colsUpdateRsvp.includes( attr.ordinal_position ) ) {
      return substitute`
  #        !${mapSubstitution(attr.column_name, nameMap, 'orm')}`;
    }
    return '';
  }
  )}`;
};

const mutUpdateVarsTemplate = ( attrs, mutations, nameMap ) => {
  let idx = 0;
  return substitute`${attrs.map(attr => {
    if ( mutations.colsUpdate.includes( attr.ordinal_position ) ) {
      return substitute`
  #       "!${mapSubstitution(attr.column_name, nameMap, 'orm')}":` +
` ${mutations.colsUpdateVar[idx++]},`;
    }
    return '';
  }
  )}`;
};

const mutUpdateMethodTemplate = ( attrs, mutations, nameMap ) => {
  let idx = 0;
  return substitute`${attrs.map(attr => {
    if ( mutations.colsUpdate.includes( attr.ordinal_position ) ) {
      return substitute`
    !${mapSubstitution(attr.column_name, nameMap, 'orm')}:` +
       ` ${mapType(attr.column_type)}${mutations.colsUpdateReqd[idx++]}`;
    }
    return '';
  }
  )}`;
};
/* eslint-enable max-len */

function typeDefinitionTemplate( tbl, mods ) {
  // LG('===================================================');
  // LG(tbl);
  // LG('===================================================');
  // LG(mods.typeDef.queries.cols);
  // LG('===================================================');
  var queries = mods.typeDef.queries;
  var mutations = mods.typeDef.mutations;
  var nameMap = mods.sequelize.attributeNameMap;
  var attrPK = getPrimaryKeyColumn(tbl);
  var typeDefs = `const Queries = \`
    ###  The items of the delivery note related by 'fkDelivery'.
    ####  Query example :
    #    {
    #      get${mods.alias.u}(${mapSubstitution(
              attrPK.column_name, nameMap, 'orm')}: 1) {${queryCommentTemplate(tbl, queries, nameMap)}
    #      }
    #    }
    get${mods.alias.u}(${querySpecificationTemplate(tbl, queries, nameMap)}
    ): [${mods.alias.u}]
\`;

const Mutations = \`

  ### Mutations
  #### Create ${mods.alias.tu}
  #    mutation create${mods.alias.u}(${mutCreateArgsTemplate(tbl, mutations, nameMap)}) {
  #      createDeliveryItem(${mutCreateCallTemplate(tbl, mutations, nameMap)}) {` +
`${mutCreateRespTemplate(tbl, mutations, nameMap)}
  #      }
  #    }
  #### Variables
  #    {${mutCreateVarsTemplate(tbl, mutations, nameMap)}
  #    }
  create${mods.alias.u}(${mutCreateMethodTemplate(tbl, mutations, nameMap)}
  ): ${mods.alias.u}

  #### Hide ${mods.alias.tu}
  #    mutation hide${mods.alias.u}(` +
        `$${mapSubstitution(attrPK.column_name, nameMap, 'orm')}:` +
        ` ${mapType(attrPK.column_type)}${attrPK.is_nullable === 'NO' ? '!' : ''}) {
  #      hide${mods.alias.u}(${mapSubstitution(attrPK.column_name, nameMap, 'orm')}:` +
        ` $${mapSubstitution(attrPK.column_name, nameMap, 'orm')}) {
  #        ${mapSubstitution(tbl[mutations.colsHideRsvp].column_name, nameMap, 'orm')}
  #      }
  #    }
  #### Variables
  #    {${mutHideVarsTemplate(tbl, mutations, nameMap)}
  #    }
  hide${mods.alias.u}(
    itemId: Int!
  ): ${mods.alias.u}

  #### Update ${mods.alias.tu}
  #    mutation update${mods.alias.u}(${mutUpdateArgsTemplate(tbl, mutations, nameMap)}) {
  #      updateDeliveryItem(${mutUpdateCallTemplate(tbl, mutations, nameMap)}) {` +
`${mutUpdateRespTemplate(tbl, mutations, nameMap)}
  #      }
  #    }
  #### Variables
  #    {${mutUpdateVarsTemplate(tbl, mutations, nameMap)}
  #    }
  update${mods.alias.u}(${mutUpdateMethodTemplate(tbl, mutations, nameMap)}
  ): ${mods.alias.u}

\`;

const Types = \`

    type ${mods.alias.u} {${dataTypeTemplate(tbl, queries, nameMap)}
      updatedAt: DateTime
      deletedAt: DateTime
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

exports.default = typeDefinitionTemplate;
