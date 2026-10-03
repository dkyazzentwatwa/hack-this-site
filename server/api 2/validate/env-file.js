const { getQuery, readBody, parseJson, sendJson } = require('../_utils');

// Student must submit a real value read from the exposed /.env file.
const ENV_VALUES = ['passw0rd!', 'weaksecret', 'admin', 'localhost'];

module.exports = async (req, res) => {
  const query = getQuery(req);
  const data = parseJson(await readBody(req)) || {};
  const secret = String(data.secret || query.secret || '').trim().toLowerCase();

  if (secret && ENV_VALUES.indexOf(secret) !== -1) {
    return sendJson(res, 200, {
      success: true,
      message: '🎯 Environment file exposure confirmed!',
      explanation: 'The /.env file was served directly, leaking database and JWT credentials. Env files must live outside the web root and never be deployed.',
      nextSteps: 'With a leaked JWT_SECRET you can forge tokens - try the /auth/jwt.html lab next. Also check /backup/config.old for more.',
      points: 80,
      labId: 'env-file'
    });
  }

  let hint = 'Open /.env and paste one of the real values you find. ';
  if (!secret) {
    hint += 'Navigate to /.env in the browser - it exposes DB_PASS, JWT_SECRET, DB_USER and DB_HOST.';
  } else {
    hint += 'That value is not in the exposed .env. Re-read the file (DB_PASS, JWT_SECRET, ...).';
  }

  return sendJson(res, 200, { success: false, hint: hint, labId: 'env-file' });
};
