const { readBody, parseJson, setCommonHeaders, sendJson } = require('../_utils');

module.exports = async (req, res) => {
  setCommonHeaders(res);
  const body = await readBody(req);
  const payload = parseJson(body) || {};
  const user = payload.user || (req.query && req.query.user) || '';
  const pass = payload.pass || (req.query && req.query.pass) || '';

  if (user !== 'admin') {
    return sendJson(res, 404, { error: 'Invalid username' });
  }
  if (pass !== 'admin123') {
    return sendJson(res, 401, { error: 'Invalid password' });
  }

  res.setHeader('Set-Cookie', 'session_id=SID-00001; Path=/');
  return sendJson(res, 200, {
    message: 'Login success',
    session: 'SID-00001',
    role: 'admin'
  });
};
