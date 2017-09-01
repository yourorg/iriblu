const LG = console.log; // eslint-disable-line no-console,no-unused-vars

const tmplt = require('./sequelizeModelTemplate').default;
const fs = require('fs');

module.exports = function ( args ) {
  const model = args.values.settings.module;
  const config = args.values.settings.config;

  const knex = require('knex')(config.rdbmsConfig);
  // const targetDir = '../target/' + config.subdirectory + '/server/model';
  // LG('   ---- Write to ', targetDir );

  const promise = knex('columns')
    .withSchema('information_schema')
    .select([
      'table_name',
      'ordinal_position',
      'column_name',
      'data_type',
      'is_nullable',
      'column_type',
      'column_key',
      'extra'
    ])
    .whereNotIn('column_name', [ 'createdAt', 'createdAt', 'deletedAt' ])
    .andWhere('table_schema', 'meteor_data')
    .andWhere('table_name', model.name);

  const target = args.destination + '/' + args.file;

  promise
  .then(function (values) {

    // LG(' --- Preparing Sequelize Models ----- : ', model.alias.u);
    // LG( values  );
    // LG(' -------------------- ');
    // LG( tmplt(values, model) );
    // LG(' --------- Writing to :: ', target);
    fs.writeFile(
      target,
      tmplt(values, model),
      function (err) {
        if(err) {
          return LG(err);
        }
//        LG(' ---------- Sequelize Models Written  ------------ \n\n\n\n\n\n');
        process.exit();
      }
    );
  })
  .catch(function (err) {
    LG('err :: ' + err);
  // })
  // .finally(function () {
  //   LG(' ----------  Done  ------------ ');
  });

};

