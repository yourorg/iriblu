const transform = require('./utils').transform;

const LG = console.log; // eslint-disable-line no-console,no-unused-vars

// const task = 'Index';
module.exports = function (settings) {
  var stctr = settings.config.structure;
  var dest = './' + settings.project +
  '/' + stctr.targetDir +
  '/' + stctr.prefix + settings.module.alias.l;
  //  +
  // '/' + task.toLowerCase();

  LG(' - Module Index Tasks ::: %s ', settings.module.alias.tu );
  LG('   - (DONE) Prepare and copy ./index.js to %s', dest );

  var parameters = {
    values: { settings },
    file: 'index.js',
    origin: './moduleBuilder/templates',
    destination: dest,
  };

  transform(parameters);

};
