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

  // Check if they uploaded a malicious file
  const uploadedExecutable = data.uploadedExecutable || query.uploadedExecutable || false;
  const uploadedPhp = data.uploadedPhp || query.uploadedPhp || false;
  const uploadedJsp = data.uploadedJsp || query.uploadedJsp || false;
  const uploadedAspx = data.uploadedAspx || query.uploadedAspx || false;
  const bypassedExtensionCheck = data.bypassedExtensionCheck || query.bypassedExtensionCheck || false;
  const uploadedWebShell = data.uploadedWebShell || query.uploadedWebShell || false;
  const fileName = data.fileName || query.fileName || '';

  // Check for common bypass techniques
  const hasDoubleExtension = /\.(jpg|png|gif)\.(php|jsp|aspx)$/i.test(fileName);
  const hasNullByte = /%00/.test(fileName);
  const hasDangerousExtension = /\.(php|jsp|aspx|exe|sh|bat|cmd)$/i.test(fileName);

  let exploitScore = 0;
  if (uploadedExecutable || uploadedPhp || uploadedJsp || uploadedAspx) exploitScore += 50;
  if (bypassedExtensionCheck) exploitScore += 30;
  if (uploadedWebShell) exploitScore += 40;
  if (hasDoubleExtension || hasNullByte) exploitScore += 20;

  const isValid = exploitScore >= 50 || (hasDangerousExtension && bypassedExtensionCheck);

  if (isValid) {
    return sendJson(res, 200, {
      success: true,
      message: "🎯 File upload vulnerability successfully exploited!",
      explanation: "You bypassed file upload restrictions and uploaded a potentially malicious file.",
      nextSteps: "Explore advanced bypass techniques like MIME type manipulation, polyglot files, or image metadata injection.",
      points: exploitScore,
      labId: 'upload'
    });
  }

  let hint = "Try uploading a file with a dangerous extension. ";
  const attemptCount = getAttemptCount(sessionId, 'upload');

  if (!hasDangerousExtension) {
    hint += "Try extensions like .php, .jsp, .aspx, or .exe.";
  } else if (!bypassedExtensionCheck) {
    hint += "The upload might be blocked. Try bypass techniques like double extensions (image.jpg.php) or null bytes.";
  } else {
    hint += "You're close. Make sure your upload would allow code execution.";
  }

  if (attemptCount > 3) {
    hint += "\n\n💡 Need help? Check the hints in the educational content above.";
  }

  return sendJson(res, 200, {
    success: false,
    hint: hint,
    attemptCount: attemptCount,
    score: exploitScore,
    labId: 'upload'
  });
};
