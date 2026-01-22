const { readBody, setCommonHeaders, sendJson } = require('./_utils');

module.exports = async (req, res) => {
  setCommonHeaders(res);
  const body = await readBody(req);
  sendJson(res, 200, {
    audit: 'Feedback',
    received: body.slice(0, 200),
    note: 'Stored without sanitization (simulated)'
  });
};
