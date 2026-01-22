const fs = require('fs');
const path = require('path');
const { setCommonHeaders, sendJson } = require('../_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  const id = req.query.id;
  const dataPath = path.join(process.cwd(), 'data', 'orders.json');
  let orders = [];
  try {
    orders = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (e) {
    orders = [];
  }
  const match = orders.find(o => String(o.id) === String(id));
  sendJson(res, 200, {
    audit: 'IDOR Orders',
    requestedId: id,
    order: match || null
  });
};
