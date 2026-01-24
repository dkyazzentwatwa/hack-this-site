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
  const orderId = query.orderId || '';
  const sessionId = query.sessionId || 'anonymous';

  // The user's actual order ID is 1001
  // Any other valid order ID (1002, 1003, etc.) demonstrates IDOR
  const userOrderId = '1001';
  const isNumeric = /^\d+$/.test(orderId);
  const isDifferentOrder = orderId !== userOrderId && orderId !== '';

  const isValid = isNumeric && isDifferentOrder && parseInt(orderId) >= 1000 && parseInt(orderId) <= 9999;

  if (isValid) {
    return sendJson(res, 200, {
      success: true,
      message: "🎯 IDOR vulnerability successfully exploited!",
      explanation: `You accessed order ${orderId} without authorization. This demonstrates Insecure Direct Object Reference.`,
      nextSteps: "Try exploring API endpoints that use predictable IDs for other resources like users or documents.",
      points: 100,
      labId: 'idor'
    });
  }

  let hint = "Try changing the order ID to access another user's order. ";
  const attemptCount = getAttemptCount(sessionId, 'idor');

  if (!isNumeric) {
    hint += "The order ID should be numeric.";
  } else if (orderId === userOrderId) {
    hint += "You're viewing your own order. Try incrementing or decrementing the ID.";
  } else if (parseInt(orderId) < 1000 || parseInt(orderId) > 9999) {
    hint += "Try order IDs in a realistic range (1000-9999).";
  } else {
    hint += "Make sure you're accessing a different valid order ID.";
  }

  if (attemptCount > 3) {
    hint += "\n\n💡 Need help? Check the hints in the educational content above.";
  }

  return sendJson(res, 200, {
    success: false,
    hint: hint,
    attemptCount: attemptCount,
    labId: 'idor'
  });
};
