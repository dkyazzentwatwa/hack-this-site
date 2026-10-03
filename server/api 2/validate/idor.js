const fs = require('fs');
const path = require('path');
const { getQuery, readBody, parseJson, sendJson } = require('../_utils');

// The authenticated student "owns" order 1001. A real IDOR solve means they
// read SOMEONE ELSE'S order and can prove it by returning that order's owner.
const USER_ORDER_ID = '1001';

function loadOrders() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'orders.json');
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (e) {
    return [];
  }
}

module.exports = async (req, res) => {
  const query = getQuery(req);
  const data = parseJson(await readBody(req)) || {};
  const orderId = String(data.orderId || query.orderId || '').trim();
  const owner = String(data.owner || query.owner || '').trim().toLowerCase();

  const orders = loadOrders();
  const match = orders.find(o => String(o.id) === orderId);

  // Evidence check: the order must exist, must NOT be the student's own,
  // and the owner they report must actually match that order.
  const accessedOther = match && orderId !== USER_ORDER_ID;
  const ownerProven = accessedOther && owner && String(match.user).toLowerCase() === owner;

  if (ownerProven) {
    return sendJson(res, 200, {
      success: true,
      message: '🎯 IDOR confirmed! You read order ' + orderId + ' (owner: ' + match.user + ').',
      explanation: 'By changing the id to ' + orderId + ' you accessed another user\'s order with no authorization check. That is Insecure Direct Object Reference.',
      nextSteps: 'Try enumerating every id (1001-1003) and note there is no ownership check anywhere. Then look at other predictable-id endpoints.',
      points: 100,
      labId: 'idor'
    });
  }

  let hint = 'Load another user\'s order, then prove what you found. ';
  if (!orderId) {
    hint += 'Enter an order id and click Load Order first.';
  } else if (!match) {
    hint += 'Order ' + orderId + ' does not exist. Valid orders are in the 1001-1003 range.';
  } else if (orderId === USER_ORDER_ID) {
    hint += 'That is your own order (1001). Increment the id to reach someone else\'s.';
  } else if (!owner) {
    hint += 'Click Load Order to retrieve order ' + orderId + ', then Validate so its owner is submitted as proof.';
  } else {
    hint += 'The owner you reported does not match order ' + orderId + '. Re-read the response body.';
  }

  return sendJson(res, 200, { success: false, hint: hint, labId: 'idor' });
};
