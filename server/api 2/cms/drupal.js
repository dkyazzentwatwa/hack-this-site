const { setCommonHeaders, sendJson } = require('../_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  sendJson(res, 200, {
    name: 'Vulnerable Drupal',
    version: '8.6.10',
    modules: ['views', 'token', 'rest']
  });
};
