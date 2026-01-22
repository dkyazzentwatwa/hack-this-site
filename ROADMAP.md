# Roadmap: Section Upgrade Plans

Below are 10+ actionable upgrade ideas for each major section. These are designed to keep the lab accessible, obvious, and practical for learners and mobile shortcut testing.

## Recon
1. Add a full metadata panel (meta tags, OpenGraph, robots hints).
2. Seed multiple HTML comments with staged secrets and TODOs.
3. Add a client-side link map exporter to JSON.
4. Create a hidden endpoints list downloadable as `/data/endpoints.txt`.
5. Add a JS bundle with hardcoded API routes for script scanners.
6. Provide a DOM visibility toggle to expose hidden elements.
7. Add a live header/cookie inspector UI calling `/api/headers` and `/api/cookies`.
8. Add a robots/sitemap comparison view with diff output.
9. Include a mock subdomain list in a hidden data file.
10. Provide a service worker analyzer page with cache inventory.

## OWASP Top 10
1. A01: add multiple IDOR endpoints (`/api/users/{id}`, `/api/files/{id}`).
2. A01: add forced-browsing wordlist hints and private paths.
3. A02: add multiple weak crypto samples (MD5, SHA1, Base64).
4. A03: add server-side reflected and stored XSS endpoints.
5. A03: add command injection and LDAP injection simulators.
6. A04: add checkout flow with step skipping and price override.
7. A05: add a misconfigured CORS lab and missing security headers view.
8. A06: add a library inventory page with version mismatch warnings.
9. A07: add password reset, MFA bypass, and remember-me tokens.
10. A08: add unsigned update manifest and missing SRI examples.
11. A09: add a verbose error endpoint that exposes stack traces.
12. A10: add SSRF with internal host allowlist bypass simulation.

## Platform Specific
1. ASP.NET: add ViewState decode helper and MAC toggle.
2. ASP.NET: expose `trace.axd` and `elmah.axd` mock pages.
3. PHP: add `phpinfo()` output and LFI/RFI simulator.
4. PHP: add type juggling test form (`0e12345`).
5. Node: expose a mock `package.json` and dependency audit page.
6. Node: add prototype pollution simulation endpoint.
7. Python: add debug toolbar output and SSTI form.
8. Java: add actuator info and Log4j probe endpoint.
9. Ruby: add mass assignment form and secret key exposure.
10. All: add fingerprint headers for server/framework detection.

## API Testing
1. REST: add BOLA endpoints (`/api/orders/{id}`) and over-posting.
2. REST: add rate-limit counter endpoint with no throttling.
3. REST: add parameter pollution endpoint with multi-value parsing.
4. REST: add versioned endpoints (`/api/v1`, `/api/v0`).
5. GraphQL: add introspection + alias overloading examples.
6. GraphQL: add depth-limit bypass with recursive query.
7. SOAP: add WSDL exposure and XXE simulation endpoint.
8. Add a live API explorer panel with copy-ready curl samples.
9. Add auth token analysis endpoint for bearer parsing.
10. Add API response diff tool for before/after testing.

## Auth & Session
1. Add login enumeration with different error messages.
2. Add brute-force simulation endpoint (no lockout).
3. Add weak password policy checker.
4. Add predictable password reset tokens.
5. Add session fixation lab with no regeneration.
6. Add JWT alg=none and weak secret validation.
7. Add remember-me token analysis with long TTLs.
8. Add 2FA bypass simulator (missing step validation).
9. Add session timeout mismatch demo.
10. Add concurrent session handling test.

## CMS Testing
1. WordPress: expose generator version and wp-json users.
2. WordPress: add plugin/theme inventory hints.
3. WordPress: add xmlrpc.php abuse simulator.
4. Drupal: expose version and module list.
5. Drupal: add user enumeration endpoints.
6. Joomla: expose version and extensions list.
7. Joomla: add config file leak simulation.
8. Add CMS fingerprint tokens in HTML comments.
9. Add common admin URLs for forced browsing.
10. Provide CMS-specific wordlists for quick scans.

## Client-Side & Storage
1. Add DOM XSS sink/source examples on dedicated pages.
2. Add unsafe `postMessage` handlers and origin bypass demo.
3. Add eval/Function usage with user input.
4. Add client-only validation bypass examples.
5. Seed localStorage/sessionStorage with tokens and PII.
6. Add IndexedDB data with sensitive fields.
7. Add service worker cache list and unscoped cache.
8. Add source map files for JS bundles.
9. Add CSP bypass examples (unsafe-inline).
10. Add iframe sandbox misconfig examples.

## Business Logic
1. Add price tampering in cart and checkout flow.
2. Add negative quantity and integer overflow tests.
3. Add coupon stacking and reuse issues.
4. Add referral abuse counters with no limits.
5. Add time-based access bypass for flash sales.
6. Add geographic restriction bypass with header toggle.
7. Add workflow skip via direct URL access.
8. Add feature flag bypass with hidden endpoints.
9. Add registration bypass for invite-only flows.
10. Add account takeover flow weaknesses.

## Utilities & Reporting
1. Add hash generator endpoint for MD5/SHA1/SHA256.
2. Add URL/Base64/HTML encoders and decoders.
3. Add timestamp converter with timezone support.
4. Add payload builder with presets for common vulns.
5. Add full-page screenshot helper for reporting.
6. Add report export to JSON/Markdown.
7. Add session manager to save testing state.
8. Add diff viewer for before/after response comparison.
9. Add request logger to capture user actions.
10. Add clipboard copy buttons for payloads.

## Quick Scans
1. Build a 5-minute recon runner that chains endpoints.
2. Add an OWASP lite scan with one lab per category.
3. Add a header audit preset that runs headers + CSP.
4. Add a quick auth audit preset (login + session + JWT).
5. Add API quick test preset (REST + GraphQL + SOAP).
6. Add client-side focus preset (DOM + storage + CSP).
7. Add CMS preset (WordPress/Drupal/Joomla cues).
8. Add e-commerce preset (logic + auth + pricing).
9. Add infrastructure preset (WAF/CDN hints).
10. Add export of quick scan results to JSON.
