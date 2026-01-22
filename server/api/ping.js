const { getQuery, setCommonHeaders, sendJson } = require('./_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  const query = getQuery(req);
  const host = query.host || '127.0.0.1';
  const suspicious = /(;|\||&&|`|\$\(|\n)/.test(host);
  sendJson(res, 200, {
    audit: 'Command Injection (Simulated)',
    input: host,
    executed: suspicious,
    output: suspicious
      ? `PING ${host}\nuid=1000(user) gid=1000(user) groups=1000(user)`
      : `PING ${host} (1 packets transmitted, 1 received)`
  });
};
