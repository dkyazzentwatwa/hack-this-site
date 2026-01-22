const { getQuery, setCommonHeaders, sendJson } = require('./_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  const query = getQuery(req);
  const id = query.id || query.user || '';
  if (/(\'|\"|--|\bor\b|\bunion\b|\bselect\b)/i.test(id)) {
    return sendJson(res, 500, {
      error: 'SQL Error: You have an error in your SQL syntax',
      query: `SELECT * FROM users WHERE id = ${id}`
    });
  }
  return sendJson(res, 200, {
    result: { id: id || '1', username: 'alice', role: 'user' },
    query: `SELECT * FROM users WHERE id = ${id || '1'}`
  });
};
