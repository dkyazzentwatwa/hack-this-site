const { setCommonHeaders, sendJson } = require('../_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  sendJson(res, 200, {
    audit: 'Secret Exposure',
    secrets: {
      apiKey: 'sk_test_123456',
      jwtSecret: 'weaksecret',
      dbPassword: 'passw0rd!'
    }
  });
};
