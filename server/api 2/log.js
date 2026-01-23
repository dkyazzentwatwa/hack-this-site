const { getQuery, readBody, parseJson, setCommonHeaders, sendJson } = require('./_utils');

module.exports = async (req, res) => {
  setCommonHeaders(res);
  const query = getQuery(req);
  const body = await readBody(req);
  const parsed = parseJson(body) || {};
  const msg = query.msg || parsed.msg || 'user=alice';

  sendJson(res, 200, {
    audit: 'Log Injection',
    message: msg,
    storedLogLine: `[INFO] ${msg}`
  });
};
