const { readBody, parseJson, setCommonHeaders, sendJson } = require('../_utils');

function decodePart(part) {
  try {
    const padded = part.replace(/-/g, '+').replace(/_/g, '/');
    const buff = Buffer.from(padded, 'base64');
    return JSON.parse(buff.toString('utf8'));
  } catch (e) {
    return null;
  }
}

module.exports = async (req, res) => {
  setCommonHeaders(res);
  const body = await readBody(req);
  const payload = parseJson(body) || {};
  const token = payload.token || (req.query && req.query.token) || '';
  const parts = token.split('.');

  const header = parts[0] ? decodePart(parts[0]) : null;
  const claims = parts[1] ? decodePart(parts[1]) : null;

  sendJson(res, 200, {
    audit: 'JWT Decoder',
    token,
    header,
    claims,
    warnings: ['No signature validation performed']
  });
};
