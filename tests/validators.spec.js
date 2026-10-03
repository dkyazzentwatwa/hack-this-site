// Evidence-based validator contracts. Run: jsc harness.js spec.js
function S(rel, opts){ return callHandler(rel, opts).json || {}; }

// ---------- IDOR: must submit the real owner of a non-own order ----------
ok(S("validate/idor", {query:{orderId:"1002", owner:"bob"}}).success === true, "IDOR: 1002/bob is valid");
ok(S("validate/idor", {query:{orderId:"1003", owner:"carol"}}).success === true, "IDOR: 1003/carol is valid");
ok(S("validate/idor", {query:{orderId:"1001", owner:"alice"}}).success !== true, "IDOR: own order 1001 is NOT a solve");
ok(S("validate/idor", {query:{orderId:"1002", owner:"alice"}}).success !== true, "IDOR: wrong owner rejected (no real access)");
ok(S("validate/idor", {query:{orderId:"5000", owner:"bob"}}).success !== true, "IDOR: nonexistent order rejected");
ok(S("validate/idor", {query:{orderId:"1002"}}).success !== true, "IDOR: no owner evidence rejected");

// ---------- SQLi: /api/sql is genuinely injectable and leaks a flag ----------
var sqlNorm = S("sql", {query:{id:"1"}});
ok(sqlNorm.result && !sqlNorm.flag, "SQL: normal id returns a single row, no flag");
var sqlErr = S("sql", {query:{id:"1'"}});
ok(sqlErr.error && /SQL/i.test(sqlErr.error), "SQL: lone quote triggers error-based message");
var sqlDump = S("sql", {query:{id:"1' OR '1'='1"}});
ok(sqlDump.flag && /^FLAG\{/.test(sqlDump.flag), "SQL: OR 1=1 dumps rows incl a FLAG");
ok(Array.isArray(sqlDump.rows) && sqlDump.rows.length >= 3, "SQL: dump returns all users");
var FLAG = sqlDump.flag;
ok(S("validate/sqli-error", {query:{flag:FLAG}}).success === true, "SQLi validate: correct flag accepted");
ok(S("validate/sqli-error", {query:{flag:"FLAG{wrong}"}}).success !== true, "SQLi validate: wrong flag rejected");
ok(S("validate/sqli-error", {query:{payload:"' OR '1'='1"}}).success !== true, "SQLi validate: pattern alone (no flag) is NOT enough");

// ---------- CORS: must submit the real header values read from the response ----------
ok(S("validate/cors", {body:{acao:"*", acac:"true"}}).success === true, "CORS: real insecure header combo accepted");
ok(S("validate/cors", {body:{acao:"https://site.com", acac:"true"}}).success !== true, "CORS: non-wildcard origin rejected");
ok(S("validate/cors", {body:{foundWildcard:"true", demonstratedAttack:"true"}}).success !== true, "CORS: old self-report flags no longer work");

// ---------- localStorage: must submit the actual seeded secrets ----------
var LS_KEY = "sk_live_51HxyzAbC123456789DEFGHabcdefghijklmnopqrstuvwxyz";
var LS_EMAIL = "admin@vulnerable-labs.local";
ok(S("validate/localstorage", {body:{api_key:LS_KEY, user_email:LS_EMAIL}}).success === true, "LS: two real secrets accepted");
ok(S("validate/localstorage", {body:{api_key:"guess", user_email:"guess"}}).success !== true, "LS: fabricated values rejected");
ok(S("validate/localstorage", {body:{foundApiKey:"true", foundEmail:"true"}}).success !== true, "LS: old self-report flags no longer work");

// ---------- secret-scanner: must submit a real discovered secret ----------
ok(S("validate/secret-scanner", {body:{secret:"weaksecret"}}).success === true, "SECRET: .env JWT secret accepted");
ok(S("validate/secret-scanner", {body:{secret:"sk_test_123456"}}).success === true, "SECRET: admin/secrets apiKey accepted");
ok(S("validate/secret-scanner", {body:{secret:"test-secret-key-DO-NOT-USE"}}).success === true, "SECRET: window.__SECRET_KEY__ accepted");
ok(S("validate/secret-scanner", {body:{secret:"hunter2"}}).success !== true, "SECRET: random guess rejected");
ok(S("validate/secret-scanner", {body:{foundEnvFile:"true"}}).success !== true, "SECRET: old self-report flag no longer works");

// ---------- security-headers: must submit the leaked fingerprint + name missing headers ----------
ok(S("validate/security-headers", {body:{aspNetVersion:"4.0.30319", missing:["content-security-policy","x-frame-options","strict-transport-security"]}}).success === true, "HEADERS: real fingerprint + 3 missing accepted");
ok(S("validate/security-headers", {body:{aspNetVersion:"9.9.9", missing:["content-security-policy","x-frame-options","strict-transport-security"]}}).success !== true, "HEADERS: wrong fingerprint rejected");
ok(S("validate/security-headers", {body:{foundMissingCSP:"true", foundMissingHSTS:"true", foundMissingXFrameOptions:"true"}}).success !== true, "HEADERS: old self-report flags no longer work");

// ---------- upload: must craft a filename that bypasses the naive filter AND would execute ----------
ok(S("validate/upload", {body:{fileName:"shell.php.jpg"}}).success !== true, "UPLOAD: ends in .jpg -> does NOT execute, not a bypass");
ok(S("validate/upload", {body:{fileName:"shell.php"}}).success !== true, "UPLOAD: plain .php is caught by the naive filter");
ok(S("validate/upload", {body:{fileName:"shell.jpg.php"}}).success !== true, "UPLOAD: final .php is caught by the naive filter");
ok(S("validate/upload", {body:{fileName:"shell.pHp"}}).success === true, "UPLOAD: case-variation (.pHp) slips the filter and executes");
ok(S("validate/upload", {body:{fileName:"shell.phtml"}}).success === true, "UPLOAD: blacklist gap (.phtml) executes");
ok(S("validate/upload", {body:{fileName:"shell.php."}}).success === true, "UPLOAD: trailing dot (.php.) slips the filter and executes");
ok(S("validate/upload", {body:{fileName:"shell.php%00.jpg"}}).success === true, "UPLOAD: null-byte truncation executes");
ok(S("validate/upload", {body:{fileName:"vacation.jpg"}}).success !== true, "UPLOAD: benign image rejected");
ok(S("validate/upload", {body:{uploadedPhp:"true", bypassedExtensionCheck:"true"}}).success !== true, "UPLOAD: old self-report flags no longer work");

// ---------- git-exposure: must submit real content read from the exposed repo ----------
ok(S("validate/git-exposure", {query:{evidence:"ref: refs/heads/main"}}).success === true, "GIT: real HEAD ref accepted");
ok(S("validate/git-exposure", {query:{evidence:"git@github.com:example/vulnerable-labs.git"}}).success === true, "GIT: real config remote url accepted");
ok(S("validate/git-exposure", {query:{evidence:"i think .git is exposed"}}).success !== true, "GIT: vague claim rejected");
ok(S("validate/git-exposure", {query:{foundGitFolder:"true"}}).success !== true, "GIT: old self-report flag no longer works");

// ---------- env-file (NEW): must submit a real value from /.env ----------
ok(S("validate/env-file", {query:{secret:"passw0rd!"}}).success === true, "ENV: DB_PASS accepted");
ok(S("validate/env-file", {query:{secret:"weaksecret"}}).success === true, "ENV: JWT_SECRET accepted");
ok(S("validate/env-file", {query:{secret:"nope"}}).success !== true, "ENV: wrong value rejected");

// ---------- clickjacking (NEW): must prove the page framed (onload fired) ----------
ok(S("validate/clickjacking", {query:{framed:"true"}}).success === true, "CLICKJACK: framed proof accepted");
ok(S("validate/clickjacking", {query:{framed:"false"}}).success !== true, "CLICKJACK: not-framed rejected");

// ---------- input-validation: keep payload-evidence behavior (encoded bypass) ----------
ok(S("validate/input-validation", {query:{payload:"%2e%2e%2f%252e%252e%252f"}}).success === true, "INPUT: encoded traversal payload accepted");
ok(S("validate/input-validation", {query:{payload:"hello"}}).success !== true, "INPUT: benign payload rejected");

summary();
