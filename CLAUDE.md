# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **deliberately vulnerable, educational cybersecurity test site** designed for penetration testing practice and mobile shortcut automation testing. Every vulnerability is intentional and labeled. **Never deploy this to production or public infrastructure you don't control.**

The site is built as a static HTML site with serverless API endpoints (Vercel Functions) that simulate vulnerable backend behaviors.

## Development Commands

### Local Development (Static Only)

```bash
# Serve static files (no API endpoints)
python3 -m http.server 3000
# or
npx serve -l 3000
```

Then open `http://localhost:3000`

### Local Development (With API Endpoints)

```bash
# Serves static pages AND /api/* serverless functions
npx vercel dev
```

This is the recommended approach for full-stack testing as it enables all `/api/*` endpoints.

### Deployment

Deploy to Vercel from the repository. No build step required.

## Architecture Overview

### Core Structure

The project is organized around **vulnerability categories** and **learning paths**:

- **Static HTML Labs**: Individual vulnerability demonstrations in `labs/` directory
- **Category Pages**: OWASP Top 10 pages (`owasp/a01.html` through `owasp/a10.html`)
- **API Endpoints**: Vulnerable serverless functions in `server/api 2/` (note the space in directory name)
- **Mock Data**: JSON files in `data/` simulate database responses

### Request Flow for API Endpoints

1. All API requests hit `/api/*`
2. Vercel routes them through `api/index.js` (the main router)
3. The router imports handlers from `server/api 2/` directory
4. Handlers use utilities from `server/api 2/_utils.js` for common operations

Example flow:
```
/api/users → api/index.js → server/api 2/users.js → data/users.json
```

### Dynamic Routes

The API router supports dynamic routes:
- `/api/orders/{id}` maps to `server/api 2/orders/[id].js`
- Query parameters are merged into `req.query`

### Key Directories

- `labs/` — Hands-on vulnerability labs (A03-006, A01-001, etc.)
- `owasp/` — OWASP Top 10 category overview pages
- `api-labs/` — API testing consoles (REST, GraphQL, SOAP)
- `auth/` — Authentication and session vulnerability demos
- `platform/` — Platform-specific testing cues (ASP.NET, PHP, Node.js, etc.)
- `cms/` — CMS vulnerability simulations (WordPress, Drupal, Joomla)
- `recon/` — Reconnaissance artifact pages
- `utilities/` — Encoding/hashing/timestamp tools
- `assets/` — Shared CSS (`styles.css`), JS (`app.js`), and vendor libraries
- `data/` — Mock JSON data files for API responses
- `server/api 2/` — Serverless function implementations (note space in name)
- `api/` — Vercel entry point and router

### Intentionally Exposed Areas

These directories are deliberately exposed for testing forced browsing and information disclosure:
- `backup/` — Mock backup files
- `admin/` — Admin area simulations
- `staging/` — Staging environment hints
- `private/` — "Hidden" areas with sensitive data
- `.env` — Exposed environment variables
- `.git/` artifacts — Git exposure vulnerabilities

## Important Implementation Details

### API Handler Pattern

All API handlers in `server/api 2/` follow this pattern:

```javascript
const { getQuery, sendJson, readBody, parseJson } = require('./_utils');

module.exports = async (req, res) => {
  const query = getQuery(req);
  // Handler logic with intentional vulnerabilities
  sendJson(res, 200, { result: 'data' });
};
```

### Vulnerability Labeling

Every lab and vulnerability uses a consistent ID format:
- `A01-001` through `A10-XXX` for OWASP Top 10 categories
- `VULN-XXX` for general vulnerabilities
- `STORAGE-XXX` for client-side storage issues

These IDs appear in:
- HTML page titles and headings
- File names
- Documentation references

### Tier 1 Labs (High Priority)

The most important labs for testing and learning:
- `A03-006` Reflected XSS: `labs/xss-reflected.html`
- `A03-001` SQLi Error: `labs/sqli-error.html`
- `A01-001` IDOR: `labs/idor.html`
- `STORAGE-001` LocalStorage: `labs/localstorage.html`
- `A02-002` Secret Scanner: `labs/secret-scanner.html`
- `VULN-007` Git Exposure: `labs/git-exposure.html`
- `VULN-008` Env File Finder: `labs/env-file.html`

## Development Guidelines

### Adding New Vulnerabilities

1. **Create the HTML lab page** in `labs/` with clear vulnerability ID
2. **Add backend endpoint** (if needed) in `server/api 2/` with intentional flaw
3. **Register endpoint** in `api/index.js` handlers object
4. **Add mock data** (if needed) in `data/` directory
5. **Update category page** in `owasp/` to link to new lab
6. **Test locally** with `npx vercel dev`

### Code Style

- **Indentation**: 2 spaces for HTML/CSS/JS
- **Naming**: Lowercase with hyphens (e.g., `sqli-error.html`)
- **Simplicity**: Keep markup readable, avoid build tooling
- **Obvious vulnerabilities**: Make flaws clear and educational, not obscure

### Security Reminders

When working on this codebase:
- **DO NOT** copy vulnerable patterns into production code
- **DO NOT** deploy to public infrastructure you don't control
- **DO** keep vulnerabilities obvious and well-documented
- **DO** include hints and comments explaining the flaw

### Testing

Validator logic has unit tests in `tests/` — run `./tests/run.sh` (macOS/jsc, no install). Also validate changes by:
1. Running locally with `npx vercel dev`
2. Opening affected pages in browser
3. Testing API endpoints with curl or browser console
4. Verifying vulnerability demonstrations work as intended

## Common Patterns

### Reading Mock Data in API Handlers

```javascript
const users = require('../../data/users.json');
// Use in response with intentional exposure
```

### Simulating Vulnerable SQL Queries

```javascript
// INTENTIONALLY VULNERABLE - for educational purposes only
const query = `SELECT * FROM users WHERE id = ${req.query.id}`;
```

### Exposing Secrets (Intentional)

Headers, comments, and JavaScript often contain:
- Mock API keys (e.g., `API_KEY=abc123secretkey`)
- Debug flags
- Internal URLs
- Database connection strings

These are **intentional** for reconnaissance practice.

## API Endpoint Categories

The API is organized by vulnerability type:

- **Core testing**: `headers`, `cookies`, `methods`, `error`, `reflect`
- **Injection**: `sql`, `ping`, `fetch`, `include`
- **Data access**: `users`, `orders`, `orders/{id}`, `search`
- **File operations**: `files`, `upload`
- **Security**: `cors`, `rate-limit`, `validate`
- **Auth**: `auth/login`, `auth/reset`, `auth/session`, `jwt/decode`
- **API formats**: `graphql`, `soap`
- **Admin**: `admin/users`, `admin/secrets`, `internal/metrics`
- **CMS**: `cms/wp-json`, `cms/drupal`, `cms/joomla`
- **Platform**: `platform/phpinfo`, `platform/aspnet`, `platform/node`, etc.
- **Utilities**: `hash`, `update`, `log`, `feedback`

## Related Documentation

- `README.md` — Quick start and structure overview
- `GUIDE.md` — Educational approach and learning paths
- `ROADMAP.md` — Future enhancement ideas (10+ per category)
- `AGENTS.md` — Repository guidelines and conventions

## Working with This Codebase

Since this is an **intentionally vulnerable training site**:
1. Analysis and documentation of vulnerabilities is encouraged
2. Creating new educational vulnerability demos is appropriate
3. Improving or securing the vulnerable code is **inappropriate** (defeats the purpose)
4. Focus on making vulnerabilities **more obvious** and **better documented**, not more hidden or realistic
