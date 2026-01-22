const { getQuery, setCommonHeaders, sendText } = require('./_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  const query = getQuery(req);
  const page = query.page || 'home.php';
  if (page.includes('..')) {
    return sendText(res, 200, 'root:x:0:0:root:/root:/bin/bash');
  }
  return sendText(res, 200, `Included page: ${page}`);
};
