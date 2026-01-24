const { getQuery, readBody, parseJson, setCommonHeaders, sendJson } = require('../_utils');

// Only these tokens are valid (students must enumerate)
// Makes it more realistic - sequential but limited range
const validTokens = new Set([
  'reset-1001', 'reset-1002', 'reset-1003', 'reset-1004', 'reset-1005',
  'reset-1006', 'reset-1007', 'reset-1008', 'reset-1009', 'reset-1010'
]);

// Map tokens to user data for more realistic responses
const tokenData = {
  'reset-1001': { email: 'user1@example.com', userId: 1 },
  'reset-1002': { email: 'user2@example.com', userId: 2 },
  'reset-1003': { email: 'admin@example.com', userId: 3 },
  'reset-1004': { email: 'user4@example.com', userId: 4 },
  'reset-1005': { email: 'user5@example.com', userId: 5 },
  'reset-1006': { email: 'support@example.com', userId: 6 },
  'reset-1007': { email: 'user7@example.com', userId: 7 },
  'reset-1008': { email: 'user8@example.com', userId: 8 },
  'reset-1009': { email: 'testuser@example.com', userId: 9 },
  'reset-1010': { email: 'guest@example.com', userId: 10 }
};

module.exports = async (req, res) => {
  setCommonHeaders(res);
  const query = getQuery(req);
  const body = await readBody(req);
  const payload = parseJson(body) || {};
  const token = query.token || payload.token || '';

  if (!validTokens.has(token)) {
    return sendJson(res, 403, {
      error: 'Invalid or expired token',
      hint: 'Tokens follow a sequential pattern within a limited range'
    });
  }

  const userData = tokenData[token];

  return sendJson(res, 200, {
    success: true,
    message: 'Password reset token is valid',
    token: token,
    email: userData.email,
    userId: userData.userId,
    hint: 'Tokens are sequential (reset-XXXX) but only certain values are valid'
  });
};
