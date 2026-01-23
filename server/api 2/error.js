const { getQuery, setCommonHeaders, sendJson } = require('./_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  const query = getQuery(req);
  const code = Number(query.code || 500);
  const status = Number.isFinite(code) ? code : 500;
  sendJson(res, status, {
    error: 'Simulated server error',
    status,
    stack: 'at handler (/srv/app/routes.js:42:13)',
    secrets: {
      DB_PASS: 'passw0rd!',
      JWT_SECRET: 'weaksecret'
    }
  });
};
