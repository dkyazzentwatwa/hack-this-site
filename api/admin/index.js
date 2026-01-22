const { setCommonHeaders, sendJson } = require('../_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  sendJson(res, 200, {
    adminEndpoints: ['/api/admin/users', '/api/admin/secrets'],
    note: 'No auth required'
  });
};
