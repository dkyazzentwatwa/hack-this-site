const { setCommonHeaders, sendJson } = require('../_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  sendJson(res, 200, {
    debug: true,
    debugger: 'Werkzeug',
    pin: '123-456-789'
  });
};
