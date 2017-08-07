import defs from './typeDefs';
import tsts from './unit';

export default {
  moduleName: '${settings.module.alias.c}',
  schemas: defs,
  tests: function tests() {
    return tsts;
  },
};
