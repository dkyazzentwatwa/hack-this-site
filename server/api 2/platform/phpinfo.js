const { setCommonHeaders, sendText } = require('../_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  res.setHeader('X-Powered-By', 'PHP/5.6.40');
  const html = '<html><body><h1>phpinfo()</h1><table><tr><td>PHP Version</td><td>5.6.40</td></tr></table></body></html>';
  sendText(res, 200, html, 'text/html; charset=utf-8');
};
