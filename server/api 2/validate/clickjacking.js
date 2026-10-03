const { getQuery, readBody, parseJson, sendJson } = require('../_utils');

// The lab embeds this page inside an <iframe>. If the frame's load event fires,
// the page is framable (no X-Frame-Options / frame-ancestors) = clickjackable.
module.exports = async (req, res) => {
  const query = getQuery(req);
  const data = parseJson(await readBody(req)) || {};
  const framed = String(data.framed != null ? data.framed : (query.framed || '')).trim().toLowerCase() === 'true';

  if (framed) {
    return sendJson(res, 200, {
      success: true,
      message: '🎯 Clickjacking confirmed! The page loaded inside an attacker-controlled iframe.',
      explanation: 'With no X-Frame-Options or Content-Security-Policy frame-ancestors, the page can be framed and overlaid with invisible controls to hijack clicks.',
      nextSteps: 'Study UI-redress attacks on sensitive actions, then compare X-Frame-Options vs. the modern CSP frame-ancestors directive.',
      points: 80,
      labId: 'clickjacking'
    });
  }

  return sendJson(res, 200, {
    success: false,
    hint: 'Use the "Attempt to frame this page" button. If the embedded iframe loads, the page has no framing protection and the solve is submitted automatically.',
    labId: 'clickjacking'
  });
};
