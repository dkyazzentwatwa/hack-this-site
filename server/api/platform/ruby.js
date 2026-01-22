const { setCommonHeaders, sendJson } = require('../_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  sendJson(res, 200, {
    rails: '5.2.1',
    secretKeyBase: 'dev-rails-secret'
  });
};
