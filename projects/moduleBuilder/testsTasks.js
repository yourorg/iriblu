var shell = require('shelljs');

const LG = console.log; // eslint-disable-line no-console,no-unused-vars
const task = 'Tests';
module.exports = function (settings) {
  LG(' - %s Tasks ::: %s ', task, settings.module.alias.tu );
  LG('   - (DONE) Prepare and copy ./index.js to %s', settings.config.structure.targetDir );
  shell.mkdir('-p',
    settings.project + '/' +
    settings.config.structure.targetDir + '/' +
    'tests'
  );
  shell.cp('-u',
    'moduleBuilder/templates/tests/index.js',
    settings.project + '/' +
    settings.config.structure.targetDir + '/' +
    'tests'
  );
};
