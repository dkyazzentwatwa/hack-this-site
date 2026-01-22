const { getQuery, setCommonHeaders, sendJson } = require('./_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  const query = getQuery(req);
  const url = query.url || '';
  const isMetadata = /169\.254\.169\.254|metadata\.google\.internal|azure\.imds/i.test(url);
  const data = isMetadata
    ? { iam: { role: 'admin', token: 'METADATA-TOKEN-EXPOSED' }, host: 'i-0abcd1234' }
    : { fetched: url, note: 'Simulated fetch (no outbound request).' };
  sendJson(res, 200, {
    audit: 'SSRF Simulation',
    requestedUrl: url,
    metadataExposed: isMetadata,
    data
  });
};
