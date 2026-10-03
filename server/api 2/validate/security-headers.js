const { getQuery, readBody, parseJson, sendJson } = require('../_utils');

// Student must (a) prove they inspected headers by reporting the leaked
// X-AspNet-Version fingerprint, and (b) name the security headers that are missing.
const FINGERPRINT = '4.0.30319';
const REQUIRED_MISSING = ['content-security-policy', 'x-frame-options', 'strict-transport-security', 'x-content-type-options'];

module.exports = async (req, res) => {
  const query = getQuery(req);
  const data = parseJson(await readBody(req)) || {};

  const fingerprint = String(data.aspNetVersion || query.aspNetVersion || '').trim();
  let missing = data.missing || query.missing || [];
  if (typeof missing === 'string') missing = missing.split(',');
  missing = missing.map(m => String(m).trim().toLowerCase()).filter(Boolean);

  const fingerprintOk = fingerprint === FINGERPRINT;
  const namedMissing = REQUIRED_MISSING.filter(h => missing.indexOf(h) !== -1);

  if (fingerprintOk && namedMissing.length >= 3) {
    return sendJson(res, 200, {
      success: true,
      message: '🎯 Header audit confirmed! Fingerprint leaked and ' + namedMissing.length + ' protections missing.',
      explanation: 'The server leaks X-AspNet-Version (' + FINGERPRINT + ') and ships none of CSP, X-Frame-Options, HSTS or X-Content-Type-Options - leaving XSS, clickjacking, downgrade and MIME-sniffing wide open.',
      nextSteps: 'Map each missing header to the attack it stops, then compare against securityheaders.com grading.',
      points: 40 + namedMissing.length * 15,
      labId: 'security-headers'
    });
  }

  let hint = 'Inspect the real response headers on /api/headers and report what you see. ';
  if (!fingerprintOk) {
    hint += 'First confirm the version leak: copy the exact X-AspNet-Version value from the response.';
  } else {
    hint += 'Good - version leak confirmed. Now name at least 3 missing headers (CSP, X-Frame-Options, HSTS, X-Content-Type-Options).';
  }

  return sendJson(res, 200, { success: false, hint: hint, labId: 'security-headers' });
};
