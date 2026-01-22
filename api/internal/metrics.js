const { setCommonHeaders, sendJson } = require('../_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  sendJson(res, 200, {
    uptime: 12345,
    build: 'staging-2026-01-22',
    debug: true
  });
};
