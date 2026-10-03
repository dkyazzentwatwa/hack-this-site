const { getQuery, readBody, parseJson, sendJson } = require('../_utils');

// Evidence = a payload that actually employs an encoding/obfuscation bypass,
// not a self-reported flag. The payload the student submits is the proof.
module.exports = async (req, res) => {
  const query = getQuery(req);
  const data = parseJson(await readBody(req)) || {};
  const payload = String(data.payload || query.payload || '');

  const checks = {
    encodedTraversal: /%2e%2e|%2e%2e%2f|\.\.%2f|%2f\.\./i.test(payload),
    doubleEncoding: /%25[0-9a-f]{2}/i.test(payload),
    nullByte: /%00|\\x00|\u0000/i.test(payload),
    altTraversal: /\.\.[\/\\]|\.\.;\/|\.\.\.\.\/\//.test(payload),
    overlongUnicode: /%c0%ae|%e0%80%ae|%uff0e/i.test(payload),
    crlf: /%0d|%0a|\r|\n/i.test(payload)
  };

  let score = 0;
  if (checks.encodedTraversal) score += 30;
  if (checks.doubleEncoding) score += 30;
  if (checks.nullByte) score += 25;
  if (checks.altTraversal) score += 20;
  if (checks.overlongUnicode) score += 25;
  if (checks.crlf) score += 15;

  const used = Object.keys(checks).filter(k => checks[k]);

  if (score >= 40) {
    return sendJson(res, 200, {
      success: true,
      message: '🎯 Encoding bypass demonstrated! Techniques: ' + used.join(', ') + '.',
      explanation: 'Your payload hides a traversal/injection behind encoding so a naive filter that only looks for literal "../" or special characters never sees it.',
      nextSteps: 'Chain encodings (e.g. %252e%252e%252f), mix in overlong UTF-8, and read how canonicalisation order causes these bypasses.',
      points: Math.min(score, 100),
      techniques: used,
      labId: 'input-validation'
    });
  }

  let hint = 'Submit a payload that smuggles a traversal past a naive filter. ';
  if (!payload) {
    hint += 'Try encoding "../" as %2e%2e%2f.';
  } else {
    hint += 'Too plain - layer encodings such as %2e%2e%2f, double-encoding (%252e%252e%252f), or a null byte (%00).';
  }

  return sendJson(res, 200, { success: false, hint: hint, score: score, labId: 'input-validation' });
};
