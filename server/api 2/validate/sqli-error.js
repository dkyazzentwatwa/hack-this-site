const { getQuery, readBody, parseJson, sendJson } = require('../_utils');

// Student must actually exfiltrate the flag from /api/sql (via ' OR '1'='1 or UNION).
const FLAG = 'FLAG{sql_injection_bypass_2024}';

module.exports = async (req, res) => {
  const query = getQuery(req);
  const data = parseJson(await readBody(req)) || {};
  const flag = String(data.flag || query.flag || '').trim();

  if (flag.toUpperCase() === FLAG.toUpperCase()) {
    return sendJson(res, 200, {
      success: true,
      message: '🎯 SQL Injection confirmed! You extracted the hidden flag.',
      explanation: 'Your payload broke out of the WHERE clause so the query returned rows it should never have, including the secret column.',
      nextSteps: 'Explore UNION-based extraction of arbitrary columns and blind/boolean SQLi where no error or data is echoed back.',
      points: 100,
      labId: 'sqli-error'
    });
  }

  let hint = 'Submit the flag you pulled out of the database, not just a payload. ';
  if (!flag) {
    hint += "Send a tautology such as ' OR '1'='1 to /api/sql, read the dumped rows, and copy the FLAG{...} value.";
  } else if (!/^FLAG\{/i.test(flag)) {
    hint += 'That does not look like the flag. It has the form FLAG{...} and appears in the secret column once the dump succeeds.';
  } else {
    hint += 'Close, but that is not the right flag. Re-run the injection and copy the exact value.';
  }

  return sendJson(res, 200, { success: false, hint: hint, labId: 'sqli-error' });
};
