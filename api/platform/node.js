const { setCommonHeaders, sendJson } = require('../_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  sendJson(res, 200, {
    name: 'vulnerable-node-app',
    dependencies: {
      express: '4.16.0',
      jsonwebtoken: '7.4.1'
    }
  });
};
