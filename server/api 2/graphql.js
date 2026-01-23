const fs = require('fs');
const path = require('path');
const { readBody, parseJson, setCommonHeaders, sendJson } = require('./_utils');

module.exports = async (req, res) => {
  setCommonHeaders(res);
  const body = await readBody(req);
  const payload = parseJson(body) || {};
  const query = payload.query || (req.query && req.query.query) || '';
  const isIntrospection = /__schema|__type/.test(query);
  if (isIntrospection) {
    const schemaPath = path.join(process.cwd(), 'data', 'graphql-schema.json');
    let schema = {};
    try {
      schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    } catch (e) {
      schema = { error: 'schema missing' };
    }
    return sendJson(res, 200, schema);
  }

  return sendJson(res, 200, {
    data: {
      viewer: { id: '1', role: 'admin' },
      note: 'GraphQL mock response'
    }
  });
};
