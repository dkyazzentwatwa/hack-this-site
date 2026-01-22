const { setCommonHeaders, sendJson } = require('./_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  // Intentionally weak cookies
  res.setHeader('Set-Cookie', [
    'session_id=SID-00001; Path=/',
    'remember_me=token123; Path=/; Max-Age=604800',
    'csrf_token=csrf-weak; Path=/'
  ]);
  sendJson(res, 200, {
    audit: 'Cookie Analyzer',
    message: 'Cookies set without Secure/HttpOnly/SameSite',
    cookies: ['session_id', 'remember_me', 'csrf_token']
  });
};
