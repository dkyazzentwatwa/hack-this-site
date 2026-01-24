const { getQuery, readBody, parseJson, sendJson } = require('../_utils');

const attempts = {};

function getAttemptCount(sessionId, labId) {
  if (!sessionId) return 0;
  const key = `${sessionId}-${labId}`;
  attempts[key] = (attempts[key] || 0) + 1;
  return attempts[key];
}

module.exports = async (req, res) => {
  const query = getQuery(req);
  const body = await readBody(req);
  const data = parseJson(body) || {};
  const sessionId = query.sessionId || 'anonymous';

  // Check if they found the sensitive data in localStorage
  const foundApiKey = data.foundApiKey || query.foundApiKey || false;
  const foundSessionToken = data.foundSessionToken || query.foundSessionToken || false;
  const foundEmail = data.foundEmail || query.foundEmail || false;
  const storageData = data.storageData || {};

  // Count how many sensitive items they found
  let foundCount = 0;
  if (foundApiKey || (storageData.localStorage && storageData.localStorage.api_key)) foundCount++;
  if (foundSessionToken || (storageData.localStorage && storageData.localStorage.session_token)) foundCount++;
  if (foundEmail || (storageData.localStorage && storageData.localStorage.user_email)) foundCount++;

  const isValid = foundCount >= 2; // Found at least 2 sensitive items

  if (isValid) {
    return sendJson(res, 200, {
      success: true,
      message: "🎯 Storage leak vulnerability successfully identified!",
      explanation: `You found ${foundCount} sensitive items in localStorage. This demonstrates why sensitive data should never be stored client-side.`,
      nextSteps: "Explore session storage and cookies for additional sensitive data exposure.",
      points: foundCount * 30,
      labId: 'localstorage'
    });
  }

  let hint = "Inspect the browser's localStorage to find sensitive data. ";
  const attemptCount = getAttemptCount(sessionId, 'localstorage');

  if (foundCount === 0) {
    hint += "Open DevTools (F12) and check the Application/Storage tab for localStorage entries.";
  } else if (foundCount === 1) {
    hint += `You found 1 item. Look for at least one more sensitive value like API keys, tokens, or user information.`;
  }

  if (attemptCount > 3) {
    hint += "\n\n💡 Need help? Check the hints in the educational content above.";
  }

  return sendJson(res, 200, {
    success: false,
    hint: hint,
    attemptCount: attemptCount,
    foundCount: foundCount,
    labId: 'localstorage'
  });
};
