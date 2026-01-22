const { getQuery, setCommonHeaders, sendText } = require('./_utils');

module.exports = (req, res) => {
  setCommonHeaders(res);
  const query = getQuery(req);
  const path = query.path || '';
  if (path.includes('..')) {
    return sendText(res, 200, 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000::/home/user:/bin/bash');
  }
  return sendText(res, 200, `File not found: ${path}`);
};
