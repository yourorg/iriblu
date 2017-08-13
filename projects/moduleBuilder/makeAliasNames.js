const LG = console.log; // eslint-disable-line no-console,no-unused-vars
const { camelize, titleCase, spacedLower, noWhite } = require('./utils');

module.exports = function (project) {

  var config = require('../' + project + '/config');

  LG('  ............... ........ ', config.rdbmsConfig.connection.host );
  LG('  ............... ........ ', config.tables[3] );
  var rec = {};
  var model = {
    name: '',
    alias: ''
  };
  config.tables.forEach( table => {
    rec = model;
    rec.name = table.name;
    rec.alias = table.alias;
//    LG( 'typeof table.alias ', typeof table.alias);
    rec.alias = (
      typeof table.alias === 'string' ) ?
      {
        o: table.alias, c: camelize(spacedLower(table.alias)),
        l: noWhite(spacedLower(table.alias)), u: noWhite(titleCase(spacedLower(table.alias))),
        tl: spacedLower(table.alias), tu: titleCase(spacedLower(table.alias)),
      } :
      table.alias;

    LG(JSON.stringify(rec, null, '\t') + ',');
  });

};
