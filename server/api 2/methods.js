const { setCommonHeaders, sendJson } = require('./_utils');

module.exports = async (req, res) => {
  setCommonHeaders(res);
  res.setHeader('Allow', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  sendJson(res, 200, {
    audit: 'HTTP Method Enumeration',
    method: req.method,
    allowed: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    note: 'All methods are allowed for testing.'
  });
};
