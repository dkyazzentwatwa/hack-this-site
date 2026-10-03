const { getQuery, readBody, parseJson, sendJson } = require('../_utils');

// Student must submit a real secret discovered somewhere in the app
// (.env, config backup, inline JS globals, or /api/admin/secrets).
const KNOWN_SECRETS = [
  'weaksecret',                    // JWT_SECRET in /.env and /api/admin/secrets
  'passw0rd!',                     // DB_PASS in /.env
  'sk_test_123456',                // apiKey in /api/admin/secrets
  'sk_live_test_123456',           // window.APP_CONFIG.authTokenHint
  'test-secret-key-do-not-use',    // window.__SECRET_KEY__
  'akia_test_example'              // AWS_KEY shown in the lab
];

module.exports = async (req, res) => {
  const query = getQuery(req);
  const data = parseJson(await readBody(req)) || {};
  const secret = String(data.secret || query.secret || '').trim().toLowerCase();

  if (secret && KNOWN_SECRETS.indexOf(secret) !== -1) {
    return sendJson(res, 200, {
      success: true,
      message: '🎯 Exposed secret confirmed!',
      explanation: 'That credential was recoverable straight from client-side code or an exposed file - no authentication needed. Secrets must never ship to the browser or the repo.',
      nextSteps: 'Keep hunting: there are secrets in /.env, /backup/config.old, inline window.* globals, and /api/admin/secrets. Then try scanners like TruffleHog / GitLeaks.',
      points: 100,
      labId: 'secret-scanner'
    });
  }

  let hint = 'Paste a real secret you found, not a description of one. ';
  if (!secret) {
    hint += 'Check View Source for window.APP_CONFIG / window.__SECRET_KEY__, fetch /api/admin/secrets, or open /.env.';
  } else {
    hint += 'That value is not one of the planted secrets. Look again in inline scripts, /.env, or /api/admin/secrets.';
  }

  return sendJson(res, 200, { success: false, hint: hint, labId: 'secret-scanner' });
};
