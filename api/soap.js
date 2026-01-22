const { readBody, setCommonHeaders, sendText } = require('./_utils');

module.exports = async (req, res) => {
  setCommonHeaders(res);
  const body = await readBody(req);
  const hasDtd = /<!DOCTYPE|SYSTEM/i.test(body);
  const response = hasDtd
    ? '<response><error>XXE detected</error><file>/etc/passwd: root:x:0:0</file></response>'
    : '<response><status>OK</status><user>alice</user></response>';
  sendText(res, 200, response, 'text/xml; charset=utf-8');
};
