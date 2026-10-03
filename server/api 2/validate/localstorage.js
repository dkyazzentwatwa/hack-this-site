const { getQuery, readBody, parseJson, sendJson } = require('../_utils');

// Student must submit the ACTUAL secret values seeded into localStorage.
const SEEDED = {
  api_key: 'sk_live_51HxyzAbC123456789DEFGHabcdefghijklmnopqrstuvwxyz',
  user_email: 'admin@vulnerable-labs.local',
  session_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIFVzZXIiLCJpYXQiOjE1MTYyMzkwMjIsImFkbWluIjp0cnVlfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
};

module.exports = async (req, res) => {
  const query = getQuery(req);
  const data = parseJson(await readBody(req)) || {};

  let found = 0;
  Object.keys(SEEDED).forEach(k => {
    const submitted = String(data[k] != null ? data[k] : (query[k] || '')).trim();
    if (submitted && submitted === SEEDED[k]) found++;
  });

  if (found >= 2) {
    return sendJson(res, 200, {
      success: true,
      message: '🎯 Storage leak confirmed! You pulled ' + found + ' real secrets out of localStorage.',
      explanation: 'These values (API key, JWT, email) were readable by any script on the page. Client-side storage offers zero confidentiality.',
      nextSteps: 'Decode the JWT at /auth/jwt.html and inspect sessionStorage too. Then consider how XSS turns this into full account takeover.',
      points: found * 40,
      labId: 'localstorage'
    });
  }

  let hint = 'Read the real values out of localStorage and submit them. ';
  if (found === 0) {
    hint += 'Click "Dump Storage" (or open DevTools - Application - Local Storage) and the lab will submit what it finds.';
  } else {
    hint += 'You proved 1 secret. Find at least one more (api_key, session_token, or user_email).';
  }

  return sendJson(res, 200, { success: false, hint: hint, foundCount: found, labId: 'localstorage' });
};
