const { getQuery, sendJson } = require('../_utils');

// Track attempts per session (in-memory store)
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

  // Check if payload would trigger XSS
  const hasScriptTag = /<script/i.test(payload);
  const hasEventHandler = /on\w+\s*=/i.test(payload);
  const hasJavascriptProtocol = /javascript:/i.test(payload);
  const hasImgTag = /<img/i.test(payload);
  const hasIframeTag = /<iframe/i.test(payload);

  const isValid = (hasScriptTag || hasEventHandler || hasJavascriptProtocol ||
                   (hasImgTag && hasEventHandler) || (hasIframeTag && /src=/i.test(payload))) &&
                   payload.length > 5;

  if (isValid) {
    return sendJson(res, 200, {
      success: true,
      message: "🎯 XSS vulnerability successfully exploited!",
      explanation: "Your payload contains executable JavaScript that would run in the victim's browser.",
      nextSteps: "Try exploring stored XSS vulnerabilities or attempt to bypass Content Security Policy (CSP) headers.",
      points: 100,
      labId: 'xss-reflected'
    });
  }

  // Provide helpful hints based on what's missing
  let hint = "Your payload didn't contain executable JavaScript. ";
  const attemptCount = getAttemptCount(sessionId, 'xss-reflected');

  if (!payload.includes('<')) {
    hint += "Try using HTML tags like <img>, <script>, or <iframe>.";
  } else if (!hasEventHandler && !hasScriptTag && !hasJavascriptProtocol) {
    hint += "Try adding an event handler like onerror=, onload=, or onclick=.";
  } else if (payload.length <= 5) {
    hint += "Your payload seems too short to be effective.";
  } else {
    hint += "Make sure your payload is properly formatted and would execute JavaScript.";
  }

  // Progressive hints based on attempt count
  if (attemptCount > 3) {
    hint += "\n\n💡 Need help? Check the hints in the educational content above.";
  }

  return sendJson(res, 200, {
    success: false,
    hint: hint,
    attemptCount: attemptCount,
    labId: 'xss-reflected'
  });
};
