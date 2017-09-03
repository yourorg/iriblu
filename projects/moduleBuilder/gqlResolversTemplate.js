'use strict';
const LG = console.log; // eslint-disable-line no-console,no-unused-vars
// const { camelize, titleCase, spacedLower, noWhite } = require('./utils');
const { camelize, substitute, mapSubstitution, getPrimaryKeyColumn } = require('./utils');

const createParmsTemplate = ( attrs, resolvers, nameMap, indent ) => {
  return substitute`${attrs.map(attr => {
    if ( resolvers.createParms.includes( attr.ordinal_position ) ) {
      return substitute`
${indent}!${mapSubstitution(camelize(attr.column_name), nameMap, 'orm')}:` +
          ` args.${mapSubstitution(camelize(attr.column_name), nameMap, 'orm')},`;
    }
    return '';
  }
  )}`;
};

function typeDefinitionTemplate( prj, tbl, mods ) {
  // LG('===================================================');
  // LG(tbl);
  // LG('===================================================');
  // LG(mods.typeDef.queries.cols);
  // LG('===================================================');
  var resolvers = mods.resolvers;
  // var mutations = mods.typeDef.mutations;
  var nameMap = mods.sequelize.attrAdaptationMap;
  var attrPK = getPrimaryKeyColumn(tbl);
  var tmpltResolvers = `import ${mods.alias.u} from './attach';
import Sequelize from 'sequelize';

const LG = console.log; // eslint-disable-line no-console,no-unused-vars

const resolvers = {

  Queries: {
    get${mods.alias.u}(_, args) {
      // LG('${mods.alias.u} :: ', ${mods.alias.u});
      let parms = {};
      parms.limit = args.limit;
      delete args.limit;
      parms.offset = args.offset;
      delete args.offset;
      parms.where = args;
      LG('${mods.alias.u} :: ', args);
      let res = ${mods.alias.u}.findAll( parms );
      // LG('return :: ', res);
      return res;
    }
  },

  Mutations: {

    create${mods.alias.u}: (_, args) => {
      LG('Creating a ${mods.alias.tu} :: ', args);
      let a${mods.alias.u} = ${mods.alias.u}.build(
        {${createParmsTemplate(tbl, resolvers, nameMap, '          ')}
        });

      return a${mods.alias.u}.save().then(
        (saveResult) => {
          const { errors, dataValues } = saveResult;
          if (dataValues) {
            LG('New ${mods.alias.tl} data values : ', dataValues);
            return ${mods.alias.u}
              .findById( dataValues.${nameMap[attrPK.column_name].orm} )
              .then(new${mods.alias.u} => {
                if (!new${mods.alias.u}) {
                  LG('Unable to find the newly created ${mods.alias.tl} :: ', ` +
                  `dataValues.${nameMap[attrPK.column_name].orm});
                  return { message: 'New ${mods.alias.tl} <' + ` +
                  `dataValues.${nameMap[attrPK.column_name].orm} + '>  created, but not found!' };
                }
                return dataValues;
              })
              .catch((error) => {
                LG('Sequelize error while reloading the ${mods.alias.tl}, "' +` +
                ` args.${mods.resolvers.mainName} + '"', error);
              });
          }
          if (errors) {
            LG('Sequelize error while finding the ${mods.alias.tl}, "' + args.${mods.resolvers.mainName} + '"', errors);
          }
        }
      ).catch( (error) => {
        LG('Sequelize error while saving the ${mods.alias.tl}, "' + args.${mods.resolvers.mainName} + '"', error);
      });
    },

    update${mods.alias.u}: (_, args) => {
      LG('Updating ${mods.alias.tl} :: ', args);
      LG('... id\\\'d by :: ', args.${nameMap[attrPK.column_name].orm});
      LG('... by ${mods.resolvers.mainName} :: ', args.${mods.resolvers.mainName});

      return ${mods.alias.u}
        .findById( args.${nameMap[attrPK.column_name].orm} )
        .then(the${mods.alias.u} => {
          if (!the${mods.alias.u}) {
            LG('Unable to find the ${mods.alias.tl} :: ', args.${nameMap[attrPK.column_name].orm});
            return { message: '${mods.alias.tu} not found' };
          }
          return the${mods.alias.u}
            .update({${createParmsTemplate(tbl, resolvers, nameMap, '              ')}
            }).then(
              (sequelizeResult) => {
                LG('**** updated ****', sequelizeResult.dataValues);
                const { errors, dataValues } = sequelizeResult;
                if (dataValues) {
                  LG('got some GraphQL results', dataValues);
                  return dataValues;
                }
                if (errors) {
                  LG('got some GraphQL execution errors', errors);
                }
              }
            ).catch( (error) => {
              LG('There was an error updating the ${mods.alias.tl} :: ', error);
            });
        })
        .catch((error) => {
          LG('There was an error finding the ${mods.alias.tl} :: ', error);
        });
    },

    hide${mods.alias.u}: (_, args) => {
      LG('Hiding a ${mods.alias.u} :: ', args);

      return ${mods.alias.u}
        .findById( args.${nameMap[attrPK.column_name].orm} )
        .then(the${mods.alias.u} => {
          if (!the${mods.alias.u}) {
            LG('Unable to find the ${mods.alias.tl} :: ', args.${nameMap[attrPK.column_name].orm});
            return { message: '${mods.alias.tu} not found' };
          }

          LG(' Date now : ', Date.now(), '  :  ' , Sequelize.literal('CURRENT_TIMESTAMP'));
          return the${mods.alias.u}
            .destroy()
            .then( sequelizeResult => {
              LG('${mods.alias.tu} hidden :: #', sequelizeResult.dataValues.${nameMap[attrPK.column_name].orm});
              const { errors, dataValues } = sequelizeResult;
              if (dataValues) {
                LG('got some GraphQL results', dataValues);
                return dataValues;
              }
              if (errors) {
                LG('got some GraphQL execution errors', errors);
              }
            }).catch( error => {
              LG('There was an error updating the ${mods.alias.tl} :: ', error);
            });
        })
        .catch((error) => {
          LG('There was an error hiding the ${mods.alias.tl} :: ', error);
        });
    },

  }
};

export default resolvers;
`;

  return tmpltResolvers;
}

exports.default = typeDefinitionTemplate;
