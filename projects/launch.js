#!/usr/bin/env node
const LG = console.log; // eslint-disable-line no-console,no-unused-vars

const semver = require('semver');

var project = null;

require('yargs') // eslint-disable-line no-unused-expressions
  .usage('$0 <cmd> [args]')
  .command('transform [project]',
    'Transform a RDBMS schema into source code files for ' +
    'a Meteor, React, Sequelize and Apollo GraphQL application.',
  {
    project: {
      default: 'iriblu',
      describe: 'the top-level directory name of the ' +
        'project for which the transformation is required.'
    }
  }, function (argv) {
    if (semver.lt(process.version, '6.0.0')) {
      LG(`* * * Version conflict * * *
Some necessary capabilities were not available in %s.
To contnue, you must install NodeJS v6.  Run "nvm use 6".
`, process.version );
      process.exit();
    } else {
      LG(`       < ------------------- >






        Starting ...

        `
      );
      LG('Will transform the RDBMS schema, specified in "'
        , argv.project, '", to the source code files for ' +
        'a Meteor, React, Sequelize and Apollo GraphQL application. '
      );
      project = require('./' + argv.project);
      project();
    }

  })
  .command('makeAliasNames [project]',
    'Transform the "alias" attribute of each object in an array from ' +
    '"alias: \'the_alias\'" to "alias: { o: \'the_alias\', c: \'theAlias\', ' +
    'l: \'thealias\', u: \'TheAlias\', tl: \'the alias\', tu: \'The Alias\', }"',
  {
    project: {
      default: 'iriblu',
      describe: 'the top-level directory name of the ' +
        'project for which the transformation is required.'
    }
  }, function (argv) {
    LG('Will display the "config" file of "%s", with all cases of alias as ' +
    'a string converted to alias as an object with upper lower and camelcase alternatives.. ', argv.project
    );
    var maker = require('./moduleBuilder/makeAliasNames.js');
    maker(argv.project);

  })
  .help()
  .argv;
