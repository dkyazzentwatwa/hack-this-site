const { getQuery, readBody, parseJson, sendJson } = require('../_utils');

// Student must submit real content read from the exposed repo metadata,
// e.g. the HEAD ref or the remote URL from .git/config.
const PROOFS = [
  'ref: refs/heads/main',
  'git@github.com:example/vulnerable-labs.git'
];

module.exports = async (req, res) => {
  const query = getQuery(req);
  const data = parseJson(await readBody(req)) || {};
  const evidence = String(data.evidence || query.evidence || '').trim().toLowerCase();

  const matched = evidence && PROOFS.some(p => evidence.indexOf(p.toLowerCase()) !== -1);

  if (matched) {
    return sendJson(res, 200, {
      success: true,
      message: '🎯 Git exposure confirmed with real repo data!',
      explanation: 'You read actual content from the exposed .git metadata. With the full directory an attacker reconstructs source history and recovers deleted secrets.',
      nextSteps: 'Run git-dumper / GitTools against an exposed /.git/ to clone the whole repo, then grep the history for credentials.',
      points: 100,
      labId: 'git-exposure'
    });
  }

  let hint = 'Fetch the exposed metadata and paste a real line from it. ';
  if (!evidence) {
    hint += 'Open /.git/HEAD or /.git/config and copy a line (e.g. the "ref:" line or the remote URL).';
  } else {
    hint += 'That is not content from the repo. Grab the exact text of /.git/HEAD or the remote URL in /.git/config.';
  }

  return sendJson(res, 200, { success: false, hint: hint, labId: 'git-exposure' });
};
