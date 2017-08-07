import ${settings.module.alias.u} from './attach';

const LG = console.log; // eslint-disable-line no-console,no-unused-vars

const resolvers = {
  Queries: {
    ${settings.module.alias.c}(_, args) {
      // LG('${settings.module.alias.u} ::: ', ${settings.module.alias.u});
      let res = ${settings.module.alias.u}.findAll({ where: args });
      return res;
    }
  }
};

export default resolvers;
