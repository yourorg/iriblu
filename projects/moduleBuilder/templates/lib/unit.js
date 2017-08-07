import ${settings.module.alias.c} from '../../iriblu_${settings.module.alias.l}';
var assert = require('assert');

export default {
  ${settings.module.alias.c}Lib() {
    describe('${settings.module.alias.tu} lib tests', function () {
      describe('${settings.module.alias.c}.lib() name test', function () {
        var expected = '${settings.module.alias.c}';
        it('should return "' + expected + '"', function () {
          var result = ${settings.module.alias.c}.Name;
          assert.equal(expected, result);
        });
      });
    });
  }
};
