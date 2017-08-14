import context from '../../server/context';
const db = context().Database;

db.import('${settings.module.alias.u}', require('./tblSqlzr'));
export default db.models.${settings.module.alias.u};
