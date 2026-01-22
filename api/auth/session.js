const { setCommonHeaders, sendJson } = require('../_utils');

function parseCookie(header) {
  const out = {};
  if (!header) return out;
  header.split(';').forEach(pair => {
    const idx = pair.indexOf('=');
    if (idx > -1) {
      const key = pair.slice(0, idx).trim();
      const val = pair.slice(idx + 1).trim();
      out[key] = val;
    }
  });
  return out;
}

module.exports = (req, res) => {
  setCommonHeaders(res);
  const cookies = parseCookie(req.headers.cookie || '');
  const session = cookies.session_id || 'SID-00001';
  sendJson(res, 200, {
    audit: 'Session Analysis',
    sessionId: session,
    entropy: 'low',
    note: 'Session ID is predictable and not rotated.'
  });
};
