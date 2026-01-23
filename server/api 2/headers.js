const { getQuery, setCommonHeaders, sendJson } = require('./_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  // Intentionally weak headers for misconfig testing
  res.setHeader('Server', 'nginx/1.14.2');
  res.setHeader('X-AspNet-Version', '4.0.30319');
  const query = getQuery(req);
  sendJson(res, 200, {
    audit: 'Header Fingerprint',
    path: req.url,
    hint: query.hint || 'no security headers set',
    headers: req.headers,
  });
};
