const transform = require('./utils').transform;
const shell = require('shelljs');
const sqlze = require('./sequelizeModel');
const rslvrs = require('./gqlResolvers');
const srvrUnit = require('./srvrUnitTest');

const LG = console.log; // eslint-disable-line no-console,no-unused-vars
const Task = 'Server';
const task = Task.toLowerCase();
module.exports = function (settings) {
  LG(' - %s Tasks ::: %s ', Task, settings.module.alias.tu );

  var parameters = {
    values: { settings },
    file: '',
    origin: '',
    destination: '',
  };

  parameters.origin = './moduleBuilder/templates/' + task;
  parameters.destination =
  './' + settings.project +
  '/' + settings.config.structure.targetDir +
  '/' + task;


// -----------------------------------------------------
  shell.mkdir('-p', parameters.destination);

// -----------------------------------------------------
  parameters.file = 'index.js';
  LG('   - (Done) Prepare and copy %s to %s',
    parameters.file,
    parameters.destination
  );
  transform(parameters);

// -----------------------------------------------------
  parameters.file = 'attach.js';
  LG('   - (Done) Prepare and copy %s to %s',
    parameters.file,
    parameters.destination
  );
  transform(parameters);

// -----------------------------------------------------
  parameters.file = 'migration.js';
  LG('   - Generate migrations : %s',
    parameters.file,
    parameters.destination
  );
  transform(parameters);

// -----------------------------------------------------
  parameters.file = 'resolvers.js';
  LG('   - Generate resolvers : %s',
    parameters.file,
    parameters.destination
  );
  rslvrs(parameters);

// -----------------------------------------------------
  parameters.file = 'tblSqlzr.js';
  LG('   - Generate sequelizer specification : %s',
    parameters.file,
    parameters.destination
  );
  sqlze(parameters);
  // transform(parameters);

// -----------------------------------------------------
  parameters.file = 'unit.js';
  LG('   - Generate server unit tests : "%s".',
    parameters.file,
    parameters.destination
  );
  srvrUnit(parameters);
  // transform(parameters);

};
