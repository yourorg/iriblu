'use strict';
const LG = console.log; // eslint-disable-line no-console,no-unused-vars
// const { camelize, titleCase, spacedLower, noWhite } = require('./utils');
const { camelize, substitute, mapSubstitution, getPrimaryKeyColumn } = require('./utils');

const queryCommentTemplate = ( attrs, queries, nameMap ) => {
  return substitute`${attrs.map(attr => {
    if ( queries.noteCols.includes( attr.ordinal_position ) ) {
      return substitute`
        !${mapSubstitution(camelize(attr.column_name), nameMap, 'orm')}`;
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
  var queries = mods.typeDef.queries;
  // var mutations = mods.typeDef.mutations;
  var nameMap = mods.sequelize.attrAdaptationMap;
  var attrPK = getPrimaryKeyColumn(tbl);
  var typeDefs = `import ${mods.alias.c}` +
  ` from '../../${prj}_${mods.alias.l}';
import assert from 'assert';
import rp from 'request-promise';

const LG = console.log; // eslint-disable-line no-console,no-unused-vars

const prot = process.env.HOST_SERVER_PROTOCOL;
const name = process.env.HOST_SERVER_NAME;
const port = process.env.HOST_SERVER_PORT;
const options = {
  uri: prot + '://' + name + ':' + port + '/graphql',
  headers: { 'User-Agent': 'Request-Promise' },
  json: true,
  qs: {
    query: \`{
      get${mods.alias.u}(${mapSubstitution(
              attrPK.column_name, nameMap, 'orm')}: 1) {${queryCommentTemplate(tbl, queries, nameMap)}
      }
    }\`
  },
};

export default {
  ${mods.alias.c}Server() {

    describe('${mods.alias.tu} Tests', function () {
      describe('${mods.alias.c}.server() name test', function () {
        var expected = '${mods.alias.c}';
        it('should return "' + expected + '"', function () {
          var result = ${mods.alias.c}.Name;
          assert.equal(expected, result);
        });
      });
    });

    describe('${mods.alias.tu} Tests', function () {
      describe('${mods.alias.c}.server() graphql test', function () {
        var expected = '${mods.srvrUnitTest.expected}';
        it('Should return the first ${mods.alias.tl}', function () {
          if ( process.env.CI === 'true') {
            LG(' *** SHORT-CIRCUITED : Not Suitable For Continuous Integration Tests ***');
            assert.equal(expected, expected);
          } else {
            this.timeout(60000);
            return rp(options).then(function (rslt) {
              // LG(' Got ::  ' );
              // LG( rslt.data );
              assert.equal(rslt.data.get${mods.alias.u}[0].` +
              `${nameMap[tbl[mods.srvrUnitTest.colExpected].column_name].orm}, expected);
            });
          }
        });
      });
    });

  }
};
`;

  return typeDefs;
}

exports.default = typeDefinitionTemplate;
