const { getQuery, sendJson } = require('../_utils');

const attempts = {};

function getAttemptCount(sessionId, labId) {
  if (!sessionId) return 0;
  const key = `${sessionId}-${labId}`;
  attempts[key] = (attempts[key] || 0) + 1;
  return attempts[key];
}

module.exports = async (req, res) => {
  const query = getQuery(req);
  const payload = query.payload || '';
  const sessionId = query.sessionId || 'anonymous';

  // Check for common input validation bypass techniques
  const hasSpecialChars = /[<>\"'`&;|$(){}[\]\\]/.test(payload);
  const hasCommandInjection = /[;|&`$()]/.test(payload);
  const hasPathTraversal = /\.\./i.test(payload);
  const hasNullByte = /%00|\\x00/i.test(payload);
  const hasOverflow = payload.length > 1000;
  const hasFormatString = /%[0-9]*[sdxfn]/i.test(payload);
  const hasUnicode = /[^\x00-\x7F]/.test(payload);

  let bypassScore = 0;
  if (hasSpecialChars) bypassScore += 20;
  if (hasCommandInjection) bypassScore += 30;
  if (hasPathTraversal) bypassScore += 25;
  if (hasNullByte) bypassScore += 30;
  if (hasOverflow) bypassScore += 15;
  if (hasFormatString) bypassScore += 20;
  if (hasUnicode) bypassScore += 15;

  const isValid = bypassScore >= 40;

  if (isValid) {
    return sendJson(res, 200, {
      success: true,
      message: "🎯 Input validation bypass successfully demonstrated!",
      explanation: "Your payload contains characters or patterns that could bypass weak input validation.",
      nextSteps: "Explore advanced bypass techniques like encoding, obfuscation, or case manipulation.",
      points: bypassScore,
      labId: 'input-validation'
    });
  }

  let hint = "Try crafting input that bypasses validation filters. ";
  const attemptCount = getAttemptCount(sessionId, 'input-validation');

  if (!hasSpecialChars) {
    hint += "Include special characters like <, >, ', \", ;, |, or &.";
  } else if (!hasCommandInjection && !hasPathTraversal) {
    hint += "Try command injection characters (;|&) or path traversal sequences (..).";
  } else {
    hint += "You're on the right track. Try combining multiple bypass techniques.";
  }

  if (attemptCount > 3) {
    hint += "\n\n💡 Need help? Check the hints in the educational content above.";
  }

  return sendJson(res, 200, {
    success: false,
    hint: hint,
    attemptCount: attemptCount,
    score: bypassScore,
    labId: 'input-validation'
  });
};
