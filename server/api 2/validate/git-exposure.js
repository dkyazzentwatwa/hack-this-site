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
  const foundGitFolder = query.foundGitFolder || false;
  const sessionId = query.sessionId || 'anonymous';

  // Check if they identified .git folder exposure
  const mentionsGit = /\.git/i.test(payload);
  const mentionsGitFolder = /\.git\//i.test(payload);
  const mentionsHead = /HEAD/i.test(payload);
  const mentionsConfig = /config/i.test(payload);
  const mentionsLogs = /logs/i.test(payload);

  const isValid = foundGitFolder || (mentionsGit && (mentionsHead || mentionsConfig || mentionsLogs));

  if (isValid) {
    return sendJson(res, 200, {
      success: true,
      message: "🎯 Git repository exposure successfully identified!",
      explanation: "You found the exposed .git folder. This allows attackers to download the entire repository history, including deleted files and secrets.",
      nextSteps: "Try using tools like git-dumper or GitTools to automatically extract exposed repositories.",
      points: 150,
      labId: 'git-exposure'
    });
  }

  let hint = "Look for exposed version control directories. ";
  const attemptCount = getAttemptCount(sessionId, 'git-exposure');

  if (!mentionsGit) {
    hint += "Check if the .git directory is accessible via web requests.";
  } else if (!mentionsHead && !mentionsConfig) {
    hint += "Try accessing .git/HEAD or .git/config to confirm the exposure.";
  } else {
    hint += "You're on the right track. Try to verify the .git folder is accessible.";
  }

  if (attemptCount > 3) {
    hint += "\n\n💡 Need help? Check the hints in the educational content above.";
  }

  return sendJson(res, 200, {
    success: false,
    hint: hint,
    attemptCount: attemptCount,
    labId: 'git-exposure'
  });
};
