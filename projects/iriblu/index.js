var config = require('./config');
var bldr = require('../moduleBuilder');
const LG = console.log; // eslint-disable-line no-console,no-unused-vars

module.exports = function () {

  // LG('  ............... ........ ', config.rdbmsConfig.connection.host );
  // LG('  ............... ........ ', config.tables[3] );

  var idx = 0;
  config.tables.forEach( table => {
    const settings = {
      project: 'iriblu',
      module: table,
      config,
    };
    if( [ 3, 10 ].includes(idx) ) {
      bldr(settings);
    } else {
      LG( '#%s TABLE :: %s', idx, table.name );
    }
    idx++;
  });

};
