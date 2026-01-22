const { setCommonHeaders, sendJson } = require('../_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  sendJson(res, 200, {
    name: 'Vulnerable WordPress',
    version: '5.2.1',
    users: [{ id: 1, name: 'admin' }, { id: 2, name: 'editor' }]
  });
};
