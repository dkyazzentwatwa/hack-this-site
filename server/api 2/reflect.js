const { getQuery, setCommonHeaders, sendText } = require('./_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  const query = getQuery(req);
  const q = query.q || query.input || '';
  const html = `<!doctype html><html><head><title>Reflect</title></head><body><h1>Reflected Output</h1><div>${q}</div></body></html>`;
  sendText(res, 200, html, 'text/html; charset=utf-8');
};
