const { setCommonHeaders, sendJson } = require('./_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  sendJson(res, 200, {
    users: [
      { id: 1, username: 'admin', email: 'admin@vulnerable-labs.local' },
      { id: 2, username: 'alice', email: 'alice@example.com' },
      { id: 3, username: 'bob', email: 'bob@example.com' }
    ]
  });
};
