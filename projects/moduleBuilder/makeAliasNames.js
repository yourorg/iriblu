const LG = console.log; // eslint-disable-line no-console,no-unused-vars

var camelize = str =>
  str
  .replace(
    /(?:^\w|[A-Z]|\b\w)/g,
    (letter, index) => {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
  .replace(/\s+/g, '');

var titleCase = str =>
  str
  .replace(
    /(?:^\w|[A-Z]|\b\w)/g,
    letter => letter.toUpperCase()
  );

var spacedLower = text => text.replace(/_/g , ' ');
var noWhite = text => text.replace(/ /g , '');

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
//    LG( 'typeof table.alias', typeof table.alias);
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
