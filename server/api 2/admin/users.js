const { setCommonHeaders, sendJson } = require('../_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  sendJson(res, 200, {
    audit: 'Broken Access Control',
    users: [
      { id: 1, username: 'admin', role: 'admin', email: 'admin@vulnerable-labs.local' },
      { id: 2, username: 'alice', role: 'user', email: 'alice@example.com' }
    ]
  });
};
