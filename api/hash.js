const crypto = require('crypto');
const { getQuery, readBody, parseJson, setCommonHeaders, sendJson } = require('./_utils');

module.exports = async (req, res) => {
  setCommonHeaders(res);
  const query = getQuery(req);
  const body = await readBody(req);
  const payload = parseJson(body) || {};
  const input = query.input || payload.input || '';

  const md5 = crypto.createHash('md5').update(input).digest('hex');
  const sha1 = crypto.createHash('sha1').update(input).digest('hex');
  const sha256 = crypto.createHash('sha256').update(input).digest('hex');

  sendJson(res, 200, { input, md5, sha1, sha256 });
};
