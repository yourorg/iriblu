import rslvrs from './resolvers';
import tests from './unit';
import migr from './migration';
import ${settings.module.alias.u} from './attach';

export default {
  moduleName: '${settings.module.alias.c}',
  model: ${settings.module.alias.u},
  migration: migr,
  resolvers: () => rslvrs,
  tests: () => tests,
};
