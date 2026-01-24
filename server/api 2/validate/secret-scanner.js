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

  // Check if they found secrets in common files
  const foundEnvFile = data.foundEnvFile || query.foundEnvFile || false;
  const foundConfigFile = data.foundConfigFile || query.foundConfigFile || false;
  const foundGitFile = data.foundGitFile || query.foundGitFile || false;
  const foundSecretInJs = data.foundSecretInJs || query.foundSecretInJs || false;
  const foundSecretInHtml = data.foundSecretInHtml || query.foundSecretInHtml || false;

  let foundCount = 0;
  if (foundEnvFile) foundCount++;
  if (foundConfigFile) foundCount++;
  if (foundGitFile) foundCount++;
  if (foundSecretInJs) foundCount++;
  if (foundSecretInHtml) foundCount++;

  const isValid = foundCount >= 1;

  if (isValid) {
    return sendJson(res, 200, {
      success: true,
      message: "🎯 Secret exposure successfully identified!",
      explanation: `You found ${foundCount} exposed secret(s). This demonstrates why sensitive data should never be committed to repositories or exposed in client-side code.`,
      nextSteps: "Try using automated tools like TruffleHog or GitLeaks to scan repositories at scale.",
      points: foundCount * 50,
      labId: 'secret-scanner'
    });
  }

  let hint = "Look for exposed secrets in common files. ";
  const attemptCount = getAttemptCount(sessionId, 'secret-scanner');

  if (foundCount === 0) {
    hint += "Check for .env files, config files, or hardcoded secrets in JavaScript/HTML files.";
  }

  if (attemptCount > 3) {
    hint += "\n\n💡 Need help? Check the hints in the educational content above.";
  }

  return sendJson(res, 200, {
    success: false,
    hint: hint,
    attemptCount: attemptCount,
    foundCount: foundCount,
    labId: 'secret-scanner'
  });
};
