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

  // Check which security headers they identified as missing or misconfigured
  const foundMissingCSP = data.foundMissingCSP || query.foundMissingCSP || false;
  const foundMissingHSTS = data.foundMissingHSTS || query.foundMissingHSTS || false;
  const foundMissingXFrameOptions = data.foundMissingXFrameOptions || query.foundMissingXFrameOptions || false;
  const foundMissingXContentType = data.foundMissingXContentType || query.foundMissingXContentType || false;
  const foundWeakCSP = data.foundWeakCSP || query.foundWeakCSP || false;
  const identifiedRisk = data.identifiedRisk || query.identifiedRisk || false;

  let score = 0;
  if (foundMissingCSP) score += 25;
  if (foundMissingHSTS) score += 20;
  if (foundMissingXFrameOptions) score += 20;
  if (foundMissingXContentType) score += 15;
  if (foundWeakCSP) score += 25;
  if (identifiedRisk) score += 20;

  const isValid = score >= 50;

  if (isValid) {
    return sendJson(res, 200, {
      success: true,
      message: "🎯 Security header vulnerabilities successfully identified!",
      explanation: "You identified multiple missing or misconfigured security headers that weaken the application's defense.",
      nextSteps: "Learn about implementing strong Content Security Policy (CSP) and other security headers.",
      points: score,
      labId: 'security-headers'
    });
  }

  let hint = "Inspect the HTTP response headers for missing security controls. ";
  const attemptCount = getAttemptCount(sessionId, 'security-headers');

  if (score === 0) {
    hint += "Open DevTools Network tab and check for missing headers like Content-Security-Policy, X-Frame-Options, or Strict-Transport-Security.";
  } else if (score < 50) {
    hint += `You found some issues (score: ${score}/100). Look for additional missing or weak security headers.`;
  }

  if (attemptCount > 3) {
    hint += "\n\n💡 Need help? Check the hints in the educational content above.";
  }

  return sendJson(res, 200, {
    success: false,
    hint: hint,
    attemptCount: attemptCount,
    score: score,
    labId: 'security-headers'
  });
};
