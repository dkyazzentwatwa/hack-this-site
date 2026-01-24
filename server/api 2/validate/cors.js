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

  // Check if they demonstrated CORS exploitation
  const demonstratedAttack = data.demonstratedAttack || query.demonstratedAttack || false;
  const foundWildcard = data.foundWildcard || query.foundWildcard || false;
  const foundCredentials = data.foundCredentials || query.foundCredentials || false;
  const exploitSuccess = data.exploitSuccess || query.exploitSuccess || false;

  let score = 0;
  if (foundWildcard) score += 30;
  if (foundCredentials) score += 30;
  if (demonstratedAttack) score += 40;
  if (exploitSuccess) score += 50;

  const isValid = score >= 60;

  if (isValid) {
    return sendJson(res, 200, {
      success: true,
      message: "🎯 CORS misconfiguration successfully exploited!",
      explanation: "You demonstrated how a misconfigured CORS policy allows cross-origin attacks to steal sensitive data.",
      nextSteps: "Explore CORS bypass techniques and understand the difference between simple and preflight requests.",
      points: score,
      labId: 'cors'
    });
  }

  let hint = "Examine the CORS policy and demonstrate an exploit. ";
  const attemptCount = getAttemptCount(sessionId, 'cors');

  if (!foundWildcard) {
    hint += "Check the Access-Control-Allow-Origin header in the response.";
  } else if (!demonstratedAttack) {
    hint += "Try crafting a cross-origin request that would steal data.";
  } else {
    hint += "Show how the misconfiguration could be exploited in a real attack.";
  }

  if (attemptCount > 3) {
    hint += "\n\n💡 Need help? Check the hints in the educational content above.";
  }

  return sendJson(res, 200, {
    success: false,
    hint: hint,
    attemptCount: attemptCount,
    score: score,
    labId: 'cors'
  });
};
