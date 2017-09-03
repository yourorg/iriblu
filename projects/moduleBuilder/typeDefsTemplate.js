'use strict';
// const { camelize, titleCase, spacedLower, noWhite } = require('./utils');
const { camelize, sentenceCase, substitute, mapSubstitution, getPrimaryKeyColumn } = require('./utils');

const LG = console.log; // eslint-disable-line no-console,no-unused-vars

var mapReplace = {
  int: 'Int',
  tinyint: 'Int',
  varchar: 'String',
  char: 'String',
  datetime: 'Date',
  timestamp: 'DateTime',
};

var specials = [ 'createdAt', 'updatedAt', 'deletedAt' ];

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

    if ( specials.includes( `${mapSubstitution(attr.column_name, nameMap, 'orm')}` ) ) {
      return ``;
    } else {
      return substitute`
      #  !${sentenceCase(mapSubstitution(attr.column_name, nameMap, 'db'))}
        !${mapSubstitution(attr.column_name, nameMap, 'orm')}: ${mapType(attr.column_type)}`;
    }
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
  let len = 0;
  attrs.map(attr => {
    if ( mutations.colsCreate.includes( attr.ordinal_position ) ) {
      len++;
    }
  })
  let arg = ``;
  return substitute`${attrs.map(attr => {
    if ( mutations.colsCreate.includes( attr.ordinal_position ) ) {
      arg = substitute`
  #      $!${mapSubstitution(attr.column_name, nameMap, 'orm')}:` +
                       ` ${mapType(attr.column_type)}` +
                       `${attr.is_nullable === 'NO' ? '!' : ''}${ --len > 0 ? ',' : ''}`;
      return arg;
    }
    return '';
  }
  )}`;
};

const mutCreateCallTemplate = ( attrs, mutations, nameMap ) => {
  let len = 0;
  attrs.map(attr => {
    if ( mutations.colsCreate.includes( attr.ordinal_position ) ) {
      len++;
    }
  })
  let arg = ``;
  return substitute`${attrs.map(attr => {
    if ( mutations.colsCreate.includes( attr.ordinal_position ) ) {
      arg = substitute`
  #        ${mapSubstitution(attr.column_name, nameMap, 'orm')}:` +
                       ` $${mapSubstitution(attr.column_name, nameMap, 'orm')}${ --len > 0 ? ',' : ''}`;
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
  let len = 0;
  let idx = 0;
  attrs.map(attr => {
    if ( mutations.colsCreate.includes( attr.ordinal_position ) ) {
      len++;
    }
  })
  return substitute`${attrs.map(attr => {
    if ( mutations.colsCreate.includes( attr.ordinal_position ) ) {
      return substitute`
  #       "!${mapSubstitution(attr.column_name, nameMap, 'orm')}":` +
` ${mutations.colsCreateVar[idx++]}${ --len > 0 ? ',' : ''}`;
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
  let len = 0;
  attrs.map(attr => {
    if ( mutations.colsHide.includes( attr.ordinal_position ) ) {
      len++;
    }
  })
  let idx = 0;
  return substitute`${attrs.map(attr => {
    if ( mutations.colsHide.includes( attr.ordinal_position ) ) {
      return substitute`
  #       "!${mapSubstitution(attr.column_name, nameMap, 'orm')}":` +
` ${mutations.colsHideVar[idx++]}${ --len > 0 ? ',' : ''}`;
    }
    return '';
  }
  )}`;
};

const mutUpdateArgsTemplate = ( attrs, mutations, nameMap ) => {
  let len = 0;
  attrs.map(attr => {
    if ( mutations.colsUpdate.includes( attr.ordinal_position ) ) {
      len++;
    }
  })
  let arg = ``;
  return substitute`${attrs.map(attr => {
    if ( mutations.colsUpdate.includes( attr.ordinal_position ) ) {
      arg = substitute`
  #      $!${mapSubstitution(attr.column_name, nameMap, 'orm')}:` +
                       ` ${mapType(attr.column_type)}` +
                       `${attr.is_nullable === 'NO' ? '!' : ''}${ len-- > 0 ? ',' : ''}`;
      return arg;
    }
    return '';
  }
  )}`;
};

const mutUpdateCallTemplate = ( attrs, mutations, nameMap ) => {
  let len = 0;
  attrs.map(attr => {
    if ( mutations.colsUpdate.includes( attr.ordinal_position ) ) {
      len++;
    }
  })
  let arg = ``;
  return substitute`${attrs.map(attr => {
    if ( mutations.colsUpdate.includes( attr.ordinal_position ) ) {
      arg = substitute`
  #        ${mapSubstitution(attr.column_name, nameMap, 'orm')}:` +
                       ` $${mapSubstitution(attr.column_name, nameMap, 'orm')}${ len-- > 0 ? ',' : ''}`;
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
  let len = 0;
  attrs.map(attr => {
    if ( mutations.colsUpdate.includes( attr.ordinal_position ) ) {
      len++;
    }
  })
  let idx = 0;
  return substitute`${attrs.map(attr => {
    if ( mutations.colsUpdate.includes( attr.ordinal_position ) ) {
      return substitute`
  #       "!${mapSubstitution(attr.column_name, nameMap, 'orm')}":` +
` ${mutations.colsUpdateVar[idx++]}${ --len > 0 ? ',' : ''}`;
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
  var nameMap = mods.sequelize.attrAdaptationMap;
  var attrPK = getPrimaryKeyColumn(tbl);
  var typeDefs = `const Queries = \`
    ###  ${mods.typeDef.queries.note}.
    ####  Query example :
    #    {
    #      get${mods.alias.u}(${mapSubstitution(
              attrPK.column_name, nameMap, 'orm')}: 1, offset: 0, limit: 10) {${queryCommentTemplate(tbl, queries, nameMap)}
    #      }
    #    }
    get${mods.alias.u}(
      offset: Int,
      limit : Int,${querySpecificationTemplate(tbl, queries, nameMap)}
    ): [${mods.alias.u}]
\`;

const Mutations = \`

  ### Mutations
  #### Create ${mods.alias.tu}
  #    mutation create${mods.alias.u}(${mutCreateArgsTemplate(tbl, mutations, nameMap)}
  #    ) {
  #      create${mods.alias.u}(${mutCreateCallTemplate(tbl, mutations, nameMap)}
  #      ) {` +
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
    ${mapSubstitution(attrPK.column_name, nameMap, 'orm')}:` +
        ` ${mapType(attrPK.column_type)}${attrPK.is_nullable === 'NO' ? '!' : ''}
  ): ${mods.alias.u}

  #### Update ${mods.alias.tu}
  #    mutation update${mods.alias.u}(${mutUpdateArgsTemplate(tbl, mutations, nameMap)}
  #    ) {
  #      update${mods.alias.u}(${mutUpdateCallTemplate(tbl, mutations, nameMap)}
  #      ) {` +
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
      #  Creation date and time (automatic)
         createdAt: DateTime
      #  Last change date and time (automatic)
         updatedAt: DateTime
      #  Disabling date and time (automatic)
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
