# Repository Guidelines

## Project Structure & Module Organization

This repo is a static, intentionally vulnerable training site. Key paths:

- `index.html` — landing page
- `home/` — main testing hub and navigation
- `resource/` — resource hub and learning guidance
- `assets/` — shared CSS/JS (`styles.css`, `app.js`, vendor libs)
- `labs/` — hands-on vulnerability labs (e.g., `labs/xss-reflected.html`)
- `owasp/`, `recon/`, `auth/`, `api/`, `platform/`, `cms/`, `utilities/` — category pages
- `api/` — serverless endpoints (Vercel functions)
- `api-labs/` — static API testing pages and consoles
- `data/` — mock JSON/data files used by endpoints
- `backup/`, `admin/`, `staging/`, `private/` — intentionally exposed areas for testing

## Build, Test, and Development Commands

No build step is required (static HTML).

- Run locally (Python):
  ```bash
  python3 -m http.server 3000
  ```
- Run locally (Node):
  ```bash
  npx serve -l 3000
  ```

Then open `http://localhost:3000`.

## Coding Style & Naming Conventions

- Indentation: 2 spaces in HTML/CSS/JS.
- Use clear, lowercase paths and filenames (e.g., `labs/idor.html`).
- Match lab IDs in headings and copy (e.g., `A03-006 Reflected XSS`).
- Keep markup simple and readable; avoid unnecessary build tooling.

## Testing Guidelines

There is no automated test suite in this repo. Validate changes by:

- Opening pages in the browser and verifying navigation.
- Running shortcut scripts against target pages.

## Commit & Pull Request Guidelines

There is no Git history included in this repository, so no existing commit convention is available. If contributing, use a short, descriptive style such as:

- `Add A03-006 reflected XSS lab`
- `Improve sidebar navigation`

PRs should include:

- A brief summary of changes
- A list of affected pages (paths)
- Screenshots if UI/visual changes were made

## Security & Configuration Notes

This repo is intentionally insecure. Do **not** deploy to public targets you do not control. Keep all secrets and vulnerable patterns limited to this training environment.
