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

  // Check for SQL injection patterns
  const hasSingleQuote = /'/.test(payload);
  const hasDoubleQuote = /"/.test(payload);
  const hasSqlKeywords = /(union|select|or|and|--|\*|;|drop|insert|update|delete)/i.test(payload);
  const hasCommentSyntax = /(--|#|\/\*|\*\/)/.test(payload);
  const hasLogicManipulation = /(or\s+1\s*=\s*1|or\s+true|'\s+or\s+'1'\s*=\s*'1)/i.test(payload);

  const isValid = (hasSingleQuote || hasDoubleQuote) &&
                  (hasSqlKeywords || hasCommentSyntax || hasLogicManipulation) &&
                  payload.length > 3;

  if (isValid) {
    return sendJson(res, 200, {
      success: true,
      message: "🎯 SQL Injection vulnerability successfully exploited!",
      explanation: "Your payload manipulates the SQL query, potentially allowing unauthorized data access.",
      nextSteps: "Try exploiting blind SQL injection or using UNION-based attacks to extract data.",
      points: 100,
      labId: 'sqli-error'
    });
  }

  let hint = "Your payload doesn't appear to be a valid SQL injection attempt. ";
  const attemptCount = getAttemptCount(sessionId, 'sqli-error');

  if (!hasSingleQuote && !hasDoubleQuote) {
    hint += "Try using quotes (') to break out of the SQL string.";
  } else if (!hasSqlKeywords && !hasCommentSyntax) {
    hint += "Try adding SQL keywords like OR, UNION, or comment syntax (--).";
  } else {
    hint += "Check your syntax - SQL injections often use logic manipulation like 'OR 1=1'.";
  }

  if (attemptCount > 3) {
    hint += "\n\n💡 Need help? Check the hints in the educational content above.";
  }

  return sendJson(res, 200, {
    success: false,
    hint: hint,
    attemptCount: attemptCount,
    labId: 'sqli-error'
  });
};
