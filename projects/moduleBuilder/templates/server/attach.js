import context from '../../server/context';
const db = context().Database;

db.import('tb${settings.module.alias.u}', require('./tblSqlzr'));
export default db.models.tb${settings.module.alias.u};
