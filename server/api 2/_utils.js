const { URL } = require('url');

function getQuery(req) {
  if (req.query) return req.query;
  try {
    const url = new URL(req.url, 'http://localhost');
    return Object.fromEntries(url.searchParams.entries());
  } catch (e) {
    return {};
  }
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', () => resolve(''));
  });
}

function parseJson(body) {
  try { return JSON.parse(body); } catch (e) { return null; }
}

function setCommonHeaders(res) {
  res.setHeader('X-Powered-By', 'Express');
  res.setHeader('Cache-Control', 'no-store');
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload, null, 2));
}

function sendText(res, status, payload, contentType = 'text/plain; charset=utf-8') {
  res.statusCode = status;
  res.setHeader('Content-Type', contentType);
  res.end(payload);
}

module.exports = {
  getQuery,
  readBody,
  parseJson,
  setCommonHeaders,
  sendJson,
  sendText,
};
