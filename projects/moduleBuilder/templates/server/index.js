import rslvrs from './resolvers';
import tsts from './unit';

export default {
  moduleName: '${settings.module.alias.c}',
  resolvers: function resolvers() {
    return rslvrs;
  },
  tests: function tests() {
    return tsts;
  },
};
