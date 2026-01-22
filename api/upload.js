const { readBody, parseJson, setCommonHeaders, sendJson } = require('./_utils');

module.exports = async (req, res) => {
  setCommonHeaders(res);
  const body = await readBody(req);
  const payload = parseJson(body) || {};
  const filename = payload.filename || 'unknown';
  const contentType = payload.contentType || 'application/octet-stream';

  const warnings = [];
  if (/\.(php|jsp|aspx|exe|js)$/i.test(filename)) warnings.push('Executable extension detected');
  if (/\.(jpg|png|gif)\.(php|jsp|aspx)$/i.test(filename)) warnings.push('Double extension detected');
  if (filename.includes('..')) warnings.push('Path traversal in filename');
  if (contentType === 'image/png' && !/\.png$/i.test(filename)) warnings.push('MIME mismatch');

  sendJson(res, 200, {
    audit: 'File Upload',
    filename,
    contentType,
    size: (payload.data || '').length,
    warnings,
    storedAs: `/uploads/${filename}`
  });
};
