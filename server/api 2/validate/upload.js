const { getQuery, readBody, parseJson, sendJson } = require('../_utils');

// The "vulnerable app" rejects a file only when the exact text after the final
// dot is a known-bad extension (case-sensitive, no normalisation). A real solve
// is a filename that slips past THIS filter yet still executes on the server.
const BLACKLIST = ['php', 'jsp', 'asp', 'aspx', 'exe', 'sh'];
const EXECUTABLE = ['php', 'phtml', 'php3', 'php4', 'php5', 'jsp', 'jspx', 'asp', 'aspx', 'exe', 'sh', 'cgi', 'pl'];

function naiveFilterBlocks(name) {
  const ext = name.split('.').pop(); // naive: last segment, no lowercasing, no trimming
  return BLACKLIST.indexOf(ext) !== -1;
}

function wouldExecute(name) {
  let effective = name;
  if (effective.indexOf('%00') !== -1) effective = effective.split('%00')[0]; // null-byte truncation
  effective = effective.replace(/[ .]+$/, '');                                 // OS strips trailing dots/spaces
  const ext = effective.split('.').pop().toLowerCase();
  return EXECUTABLE.indexOf(ext) !== -1;
}

module.exports = async (req, res) => {
  const query = getQuery(req);
  const data = parseJson(await readBody(req)) || {};
  const fileName = String(data.fileName || query.fileName || '').trim();

  const blocked = naiveFilterBlocks(fileName);
  const executes = wouldExecute(fileName);

  if (fileName && !blocked && executes) {
    return sendJson(res, 200, {
      success: true,
      message: '🎯 Upload filter bypassed! "' + fileName + '" would run as server-side code.',
      explanation: 'The filter only checked the literal final extension, so a case change, blacklist gap, trailing dot, or null byte sneaks an executable file past it.',
      nextSteps: 'Try MIME/Content-Type spoofing and magic-byte (polyglot) images, then read about allow-list + content inspection as the real fix.',
      points: 100,
      labId: 'upload'
    });
  }

  let hint = 'Craft a filename the weak filter allows but the server still executes. ';
  if (!fileName) {
    hint += 'Type a filename in the upload simulator first.';
  } else if (blocked) {
    hint += '"' + fileName + '" is caught by the extension blacklist. Disguise the extension instead of using a plain .php/.jsp/.aspx.';
  } else if (!executes) {
    hint += '"' + fileName + '" passes the filter but would be served as a harmless file. Make it resolve to an executable type.';
  }

  return sendJson(res, 200, { success: false, hint: hint, labId: 'upload' });
};
