const { getQuery, readBody, parseJson, setCommonHeaders, sendJson } = require('../_utils');

module.exports = async (req, res) => {
  setCommonHeaders(res);
  const query = getQuery(req);
  const body = await readBody(req);
  const payload = parseJson(body) || {};
  const token = query.token || payload.token || '';
  const valid = /^reset-\d+$/.test(token);

  if (!valid) {
    return sendJson(res, 400, { error: 'Invalid reset token' });
  }

  return sendJson(res, 200, {
    message: 'Password reset successful',
    token
  });
};
