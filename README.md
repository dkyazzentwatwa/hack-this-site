# Vulnerable Pentest Toolkit Lab

A deliberately vulnerable, **educational** cybersecurity test site built to support mobile pentest shortcuts and hands‑on learning. This project is **intentionally insecure** and should only be used in safe, isolated training environments.

## Purpose

- Provide labeled, obvious targets for reconnaissance and vulnerability testing.
- Help validate mobile shortcut automations ("Run JS in Active Browser").
- Offer a clean, structured learning path aligned to OWASP Top 10 and common platform flaws.

## Warning

This site includes intentionally dangerous patterns, exposed secrets, weak auth, and insecure client‑side behavior. **Do not deploy this in production or on any public infrastructure you don’t control.**

## Quick Start (Local)

```bash
python3 -m http.server 3000
```

Open:

```
http://localhost:3000
```

## Local With API Endpoints

To run serverless endpoints locally, use Vercel CLI:

```bash
npx vercel dev
```

This serves static pages and `/api/*` functions together.

## Deploy (Vercel)

This is a static site. You can deploy directly from the repo using Vercel’s default static hosting flow.

## Structure Overview

- `index.html` — landing page
- `home/` — main testing hub + Tier 1 labs
- `resource/` — education resource hub and learning path
- `recon/` — passive/active recon artifacts
- `owasp/` — A01–A10 category pages
- `labs/` — hands‑on vulnerability labs
- `auth/` — login/session/JWT labs
- `api-labs/` — REST/GraphQL/SOAP testing pages
- `api/` — serverless endpoints (Vercel functions)
- `platform/` — platform‑specific cues
- `cms/` — WordPress/Drupal/Joomla targets
- `utilities/` — encoding, hashing, timestamp helpers

## Tier 1 Labs (Priority)

- `A03-006` Reflected XSS: `labs/xss-reflected.html`
- `A03-001` SQLi Error: `labs/sqli-error.html`
- `A01-001` IDOR: `labs/idor.html`
- `STORAGE-001` LocalStorage: `labs/localstorage.html`
- `A02-002` Secret Scanner: `labs/secret-scanner.html`
- `VULN-007` Git Exposure: `labs/git-exposure.html`
- `VULN-008` Env File Finder: `labs/env-file.html`

## Educational Guide

See `GUIDE.md` for the training approach, topic map, and recommended learning flow.
See `ROADMAP.md` for a 10+ ideas-per-section upgrade plan.

## Safety Notes

- This repo intentionally exposes `.env`, `.git` artifacts, weak cookies, and mock secrets.
- Do not reuse code snippets in production systems.
- Keep deployments isolated and clearly labeled as training only.

## License

Use at your own risk for educational purposes only.
