const { setCommonHeaders, sendJson } = require('./_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  sendJson(res, 200, {
    version: '1.2.3',
    url: '/downloads/app-update.zip',
    signature: null,
    note: 'Unsigned update manifest'
  });
};
