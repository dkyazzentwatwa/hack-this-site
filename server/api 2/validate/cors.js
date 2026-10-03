const { getQuery, readBody, parseJson, sendJson } = require('../_utils');

// Student reads the ACTUAL response headers from /api/cors and submits them.
module.exports = async (req, res) => {
  const query = getQuery(req);
  const data = parseJson(await readBody(req)) || {};
  const acao = String(data.acao || query.acao || '').trim();
  const acac = String(data.acac || query.acac || '').trim().toLowerCase();

  const wildcard = acao === '*';
  const credentials = acac === 'true';

  if (wildcard && credentials) {
    return sendJson(res, 200, {
      success: true,
      message: '🎯 CORS misconfiguration confirmed!',
      explanation: 'Access-Control-Allow-Origin: * combined with Access-Control-Allow-Credentials: true lets any site make authenticated cross-origin requests and read the response.',
      nextSteps: 'Note that browsers actually forbid "*" WITH credentials - real-world bugs reflect the attacker Origin instead. Explore origin-reflection CORS next.',
      points: 100,
      labId: 'cors'
    });
  }

  let hint = 'Read the real CORS headers off the /api/cors response and submit them. ';
  if (!acao) {
    hint += 'Click "Call /api/cors" first - the lab captures Access-Control-Allow-Origin and -Credentials for you.';
  } else if (!wildcard) {
    hint += 'Access-Control-Allow-Origin you reported is "' + acao + '". The dangerous value is a wildcard "*".';
  } else if (!credentials) {
    hint += 'You found the wildcard origin. Now confirm Access-Control-Allow-Credentials is true.';
  }

  return sendJson(res, 200, { success: false, hint: hint, labId: 'cors' });
};
