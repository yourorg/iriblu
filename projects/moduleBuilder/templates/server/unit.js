import ${settings.module.alias.c} from '../../${settings.config.structure.prefix}${settings.module.alias.l}';
import assert from 'assert';
import rp from 'request-promise';

const LG = console.log; // eslint-disable-line no-console,no-unused-vars

const prot = process.env.HOST_SERVER_PROTOCOL;
const name = process.env.HOST_SERVER_NAME;
const port = process.env.HOST_SERVER_PORT;
const options = {
  uri: prot + '://' + name + ':' + port + '/graphql',
  headers: { 'User-Agent': 'Request-Promise' },
  json: true,
  qs: {
    query: `{
      ${settings.module.alias.c}(entrega_lines_id: 1) {
        entrega_lines_id
        cod
        entrega_id
        createdAt
      }
    }`
  },
};

export default {
  ${settings.module.alias.c}Server() {

    describe('${settings.module.alias.tu} Tests', function () {
      describe('${settings.module.alias.c}.server() name test', function () {
        var expected = '${settings.module.alias.c}';
        it('should return "' + expected + '"', function () {
          var result = ${settings.module.alias.c}.Name;
          assert.equal(expected, result);
        });
      });
    });

    describe('${settings.module.alias.tu} Tests', function () {
      describe('${settings.module.alias.c}.server() graphql test', function () {
        var expected = 'IBAA001';
        it('Should return the first delivery code', function () { // no done
          this.timeout(60000);
          return rp(options).then(function (rslt) {
            assert.equal(rslt.data.${settings.module.alias.c}[0].cod, expected);
          });
        });
      });
    });

  }
};
