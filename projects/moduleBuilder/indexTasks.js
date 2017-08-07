const transform = require('./utils').transform;

const LG = console.log; // eslint-disable-line no-console,no-unused-vars

const task = 'Index';
module.exports = function (settings) {
  LG(' - %s Tasks ::: %s ', task, settings.module.alias.tu );
  LG('   - (DONE) Prepare and copy ./index.js to %s', settings.config.structure.targetDir );

  var parameters = {
    values: { settings },
    file: 'index.js',
    origin: './moduleBuilder/templates',
    destination: './' + settings.project +
    '/' + settings.config.structure.targetDir,
  };

  transform(parameters);

};
