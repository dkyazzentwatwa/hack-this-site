const fs = require('fs');
const path = require('path');
const { setCommonHeaders, sendJson } = require('./_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  const dataPath = path.join(process.cwd(), 'data', 'orders.json');
  let orders = [];
  try {
    orders = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (e) {
    orders = [];
  }
  sendJson(res, 200, { orders });
};
