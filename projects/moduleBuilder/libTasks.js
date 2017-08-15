const transform = require('./utils').transform;
const shell = require('shelljs');
const deftyp = require('./defineTypes');

const LG = console.log; // eslint-disable-line no-console,no-unused-vars
const Task = 'Lib';
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
  parameters.file = 'typeDefs.js';
  LG('   - Generate type definitions : "%s".',
    parameters.file,
    parameters.destination
  );
  deftyp(parameters);
  // transform(parameters);

// -----------------------------------------------------
  parameters.file = 'unit.js';
  LG('   - (DONE) Prepare and copy %s.',
    parameters.file
  );
  transform(parameters);

};