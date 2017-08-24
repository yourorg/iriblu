var shell = require('shelljs');

const LG = console.log; // eslint-disable-line no-console,no-unused-vars
const Task = 'Tests';
const task = 'tests';
module.exports = function (settings) {
  var stctr = settings.config.structure;
  var dest = './' + settings.project +
  '/' + stctr.targetDir +
  '/' + stctr.prefix + settings.module.alias.l +
  '/' + task;

  LG(' - %s Tasks ::: %s ', Task, settings.module.alias.tu );
  LG('   - (DONE) Prepare and copy ./index.js to %s', dest );

  shell.mkdir('-p', dest);

  shell.cp('-u',
    'moduleBuilder/templates/tests/index.js',
    dest
  );
};
