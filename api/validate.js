const { getQuery, setCommonHeaders, sendJson } = require('./_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  const query = getQuery(req);
  const input = query.input || '';
  const findings = [];

  if (/%00/.test(input)) findings.push('Null byte detected');
  if (/%25[0-9a-f]{2}/i.test(input)) findings.push('Double encoding detected');
  if (/[\uFF00-\uFFFF]/.test(input)) findings.push('Unicode normalization risk');
  if (input.length > 200) findings.push('Length overflow risk');
  if (/%0d|%0a/i.test(input)) findings.push('CRLF injection risk');

  sendJson(res, 200, {
    audit: 'Input Validation',
    input,
    findings
  });
};
