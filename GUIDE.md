# Educational Guide: Vulnerable Pentest Toolkit Lab

## Why This Exists

This site is intentionally insecure so students and practitioners can **practice detection, enumeration, and exploitation in a safe environment**. Every page is labeled to match real‑world categories, making it easy to cross‑reference learning resources and automation scripts.

## Learning Goals

- Understand how common vulnerabilities appear in HTML, JS, headers, storage, and endpoints.
- Practice identifying vulnerabilities with manual inspection and automated shortcuts.
- Build a mental model for recon → identify → validate → report.
  d
## How to Use This Lab

1. **Start with Recon** (`/recon/`) to practice passive and active discovery.
2. **Move to Tier 1 Labs** for high‑impact vulnerabilities.
3. Use **OWASP category pages** to explore specific vulnerability classes.
4. Validate findings using your mobile shortcut scripts.
5. Record results in a structured format (JSON/Markdown reports).

## Topic Map (Aligned to Your Shortcut Blueprint)

### Phase 1: Reconnaissance
- **Passive Recon**: comments, hidden elements, metadata, forms, scripts, social links.
- **Active Recon**: headers, cookies, robots/sitemap, error pages, method enumeration.

### Phase 2: Vulnerability Scanning (OWASP Top 10)
- **A01** Broken Access Control: IDOR, forced browsing, path traversal.
- **A02** Crypto Failures: secrets in code, weak crypto usage.
- **A03** Injection: XSS, SQLi, command injection (simulated).
- **A04** Insecure Design: business logic manipulation.
- **A05** Misconfig: missing headers, exposed backups.
- **A06** Vulnerable Components: outdated libraries.
- **A07** Auth Failures: brute force, weak password flows.
- **A08** Integrity Failures: missing SRI, weak update trust.
- **A09** Logging Failures: verbose errors, log injection.
- **A10** SSRF: URL fetch simulation.

### Phase 3: Platform‑Specific Testing
- ASP.NET, PHP, Node.js, Python, Java, Ruby lab pages provide clues like config files, debug flags, and framework markers.

### Phase 4: API Security Testing
- REST: endpoint enumeration, BOLA hints.
- GraphQL: schema exposure and depth test cues.
- SOAP/XML: WSDL exposure and XXE hints.

### Phase 5: Client‑Side Security
- DOM sinks, unsafe reflection, exposed globals, source maps, storage leaks.

### Phase 6: Auth & Session
- Weak session IDs, login enumeration, JWT issues.

### Phase 7: Input Validation
- Parameter fuzzing, null byte and encoding hints in lab inputs.

### Phase 8: Business Logic
- Price, quantity, and coupon manipulation (client‑side).

### Phase 9: CMS Testing
- WordPress, Drupal, Joomla signals (generator tags, common endpoints).

### Phase 10: Infrastructure
- Simulated CDN bypass, WAF detection, cloud provider clues.

### Phase 11: Reporting & Utilities
- Use `/utilities/` for encoding, hashing, and timestamp conversion.

## Safe Use Rules

- This lab is for **education and testing only**.
- Do not deploy on public targets that you do not own or have permission to test.
- Avoid copying patterns into production systems.

## Suggested Learning Order

1. Recon
2. Tier 1 Labs
3. OWASP A01–A10
4. Auth & Session
5. API Security
6. Platform Specific and CMS
7. Utilities and Reporting

## Shortcuts Integration Tips

- Use consistent labels (script IDs) in your shortcut output.
- Capture: URL, timestamp, severity, findings.
- Save results to JSON so you can diff before/after states.

---

A machine-readable lab catalog already ships in `data/lab-metadata.json` (IDs, difficulty, category, time estimates) and `data/lab-content.json` (what/why/steps/hints/fix). Point your shortcuts and reporting at those files.
