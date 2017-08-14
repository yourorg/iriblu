import ${settings.module.alias.u} from './attach';
import { RDBMS as sequelize } from '../../api/meteorDependencies.js';

const LG = console.log; // eslint-disable-line no-console,no-unused-vars
const entity = '${settings.module.alias.u}';
const tblLegacy = '${settings.module.name}';
const attrLegacy = '${ settings.module.sequelize.attrLegacy }';
const tblTarget = '${settings.module.alias.o}';
const attrTarget = '${ settings.module.sequelize.attrTarget }';
module.exports = function () {

  return ${settings.module.alias.u}.findAll({
    attributes: [ [ sequelize.fn('COUNT', sequelize.col('code')), 'numRows' ] ]
  }).then( res => {
    if ( res[0].dataValues.numRows > 0 ) {
      LG('Table "%s" has %s rows', entity, res[0].dataValues.numRows );
    } else {
      LG('Migrating data into table "%s".', entity );
      return sequelize.query(
        /* eslint-disable quotes */
        `INSERT INTO ` + tblTarget +
         ` ( ` + attrTarget + `, createdAt, updatedAt )
           SELECT ` + attrLegacy + `, createdAt, createdAt as updatedAt
           FROM  ` + tblLegacy,
        { type: sequelize.QueryTypes.INSERT }
        /* eslint-enable quotes */
      ).then( rpt => {
        LG(' - Last "item_id" of %s for %s rows inserted into "%s".', rpt[0], rpt[1], entity);
      }).catch( err => LG('query error. ' + err.message));
    }
  }).catch( err => LG('findAll error. ' + err.message));

};
