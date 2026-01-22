const { setCommonHeaders, sendJson } = require('./_utils');

let counter = 0;

module.exports = (req, res) => {
  setCommonHeaders(res);
  counter += 1;
  sendJson(res, 200, {
    audit: 'Rate Limit Check',
    requestCount: counter,
    note: 'No rate limiting enforced.'
  });
};
