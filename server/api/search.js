const { getQuery, setCommonHeaders, sendJson } = require('./_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  const query = getQuery(req);
  const q = query.q || '';
  sendJson(res, 200, {
    audit: 'Search Endpoint',
    query: q,
    results: ['/admin/console', '/backup/db.sql', '/private/admin-bypass.html']
  });
};
