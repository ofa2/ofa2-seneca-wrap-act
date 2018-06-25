'use strict';

var util = require('util');

function wrapAct() {
  if (!this.seneca) {
    throw new Error('no seneca found');
  }

  if (!global.Errors) {
    throw new Error('no global Errors found');
  }

  let act = util.promisify(this.seneca.act.bind(this.seneca)); // expose global promise act

  global.act = async function actAsync(msg, ...args) {
    if (global.als) {
      let traceId = global.als.get('traceId');
      msg.traceId = msg.traceId === undefined ? traceId : msg.traceId;
    }

    let result = await act(msg, ...args);

    if (result && result.errcode) {
      if (!Errors[result.errcode]) {
        throw new Error(`no error name found ${result.errcode} for ${result.errmsg}`);
      }

      throw new Errors[result.errcode](result.extra);
    }

    return result;
  };
}

module.exports = wrapAct;
//# sourceMappingURL=bundle.cjs.js.map
