const { getQuery, setCommonHeaders, sendJson } = require('./_utils');

// Simulated users table. The "secret" column holds the flag an attacker exfiltrates.
const USERS = [
  { id: 1, username: 'alice', role: 'user', secret: 'FLAG{sql_injection_bypass_2024}' },
  { id: 2, username: 'bob', role: 'user', secret: 'FLAG{sql_injection_bypass_2024}' },
  { id: 3, username: 'admin', role: 'admin', secret: 'FLAG{sql_injection_bypass_2024}' }
];
const FLAG = USERS[0].secret;

module.exports = (req, res) => {
  setCommonHeaders(res);
  const query = getQuery(req);
  const id = (query.id != null ? query.id : query.user) || '';
  const builtQuery = 'SELECT id, username, role, secret FROM users WHERE id = ' + (id || '1');

  const lower = String(id).toLowerCase();
  const tautology = /('|\b)or\b\s*('?\d'?\s*=\s*'?\d'?|true)/i.test(lower) || /or\s+1\s*=\s*1/i.test(lower);
  const unionSelect = /union\s+select/i.test(lower);
  const hasInjectionSyntax = /('|"|--|#|\bunion\b|\bselect\b)/i.test(String(id));

  // Classic injection: tautology or UNION dumps the whole table, leaking the flag.
  if (tautology || unionSelect) {
    return sendJson(res, 200, {
      audit: 'SQL Injection (Error/Union)',
      query: builtQuery,
      note: 'Injection succeeded - the WHERE clause was bypassed and every row was returned.',
      rows: USERS.map(u => ({ id: u.id, username: u.username, role: u.role, secret: u.secret })),
      flag: FLAG
    });
  }

  // A broken-but-not-weaponized payload (e.g. a lone quote) returns a verbose DB error.
  if (hasInjectionSyntax) {
    return sendJson(res, 500, {
      audit: 'SQL Injection (Error)',
      error: "SQL Error: You have an error in your SQL syntax near '" + id + "' at line 1",
      query: builtQuery,
      hint: 'Error-based SQLi works. Now bypass the WHERE clause with a tautology like \' OR \'1\'=\'1 to dump the table.'
    });
  }

  // Normal lookup: single row, no secret column exposed.
  const match = USERS.find(u => String(u.id) === String(id)) || { id: id || '1', username: 'alice', role: 'user' };
  return sendJson(res, 200, {
    audit: 'SQL Lookup',
    query: builtQuery,
    result: { id: match.id, username: match.username, role: match.role }
  });
};
