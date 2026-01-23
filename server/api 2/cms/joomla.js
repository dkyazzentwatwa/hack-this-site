const { setCommonHeaders, sendJson } = require('../_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  sendJson(res, 200, {
    name: 'Vulnerable Joomla',
    version: '3.9.0',
    extensions: ['com_users', 'com_content']
  });
};
