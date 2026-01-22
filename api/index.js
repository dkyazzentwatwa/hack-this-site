module.exports = (req, res) => {
  res.statusCode = 302;
  res.setHeader('Location', '/api-labs/');
  res.end('Redirecting to /api-labs/');
};
