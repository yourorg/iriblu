import ${settings.module.alias.c} from '../../iriblu_${settings.module.alias.l}';
var assert = require('assert');

export default {
  ${settings.module.alias.c}Client() {
    describe('${settings.module.alias.tu} client tests', function () {
      describe('${settings.module.alias.c}.client() name test', function () {
        var expected = '${settings.module.alias.c}';
        it('should return "' + expected + '"', function () {
          var result = ${settings.module.alias.c}.Name;
          assert.equal(expected, result);
        });
      });
    });
  }
};
