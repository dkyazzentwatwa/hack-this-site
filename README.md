# VulnLab Academy

A deliberately vulnerable, **educational** cybersecurity training platform designed for self-paced learning and hands-on vulnerability testing. This project is **intentionally insecure** and should only be used in safe, isolated training environments.

## Purpose

- **Educational Training:** Comprehensive learning environment for mixed skill levels (beginner → advanced)
- **Hands-On Labs:** 12+ vulnerability labs with automated validation and progressive hints
- **Mobile Testing:** Support mobile pentest shortcuts and automation testing
- **OWASP Aligned:** Structured learning path following OWASP Top 10 vulnerabilities
- **Progress Tracking:** Built-in dashboard to monitor completion and maintain learning streaks

## Features

### 🎓 Educational Content System
- **What/Why/How:** Each lab explains the vulnerability, its impact, and exploitation steps
- **Progressive Hints:** 3-tier hint system (beginner → intermediate → solution)
- **Code Comparisons:** Side-by-side examples of vulnerable vs. secure code
- **CVSS Ratings:** Industry-standard severity scores for each vulnerability
- **Related Labs:** Guided learning path with suggested next steps

### ✅ Automated Validation
- **Instant Feedback:** Real-time validation of exploitation attempts
- **Smart Hints:** Context-aware guidance when attempts fail
- **Progress Tracking:** Automatic completion tracking via localStorage
- **Achievement System:** Track labs completed, streaks, and category progress

### 📊 Progress Dashboard
- **Completion Stats:** Visual tracking of labs completed (X/12)
- **Category Breakdown:** Progress by OWASP category (A01, A03, A05, etc.)
- **Learning Streaks:** Daily streak counter to maintain momentum
- **Progress Bars:** Animated visual feedback for completion percentage

### 🔍 Search & Filter
- **Real-time Search:** Instant filtering by lab name, category, or tag
- **Difficulty Filters:** Filter by beginner, intermediate, or advanced
- **Category Filters:** Filter by OWASP category (A01, A03, etc.)
- **Results Counter:** Shows matching labs vs. total available

### 📱 Mobile Responsive
- **Collapsible Sidebar:** Hamburger menu with smooth slide-in navigation
- **Touch Optimized:** 44px+ touch targets for mobile devices
- **Auto-close:** Sidebar automatically closes after navigation
- **Backdrop Overlay:** Semi-transparent overlay with blur effect

### 🎨 Enhanced UX
- **Breadcrumb Navigation:** Always know where you are in the hierarchy
- **Active Highlighting:** Current page highlighted in sidebar
- **Loading States:** Visual feedback during API requests
- **Success/Error Banners:** Clear, animated messages for user actions
- **Difficulty Badges:** Color-coded badges showing lab difficulty and time estimates

## Warning

This site includes intentionally dangerous patterns, exposed secrets, weak auth, and insecure client‑side behavior. **Do not deploy this in production or on any public infrastructure you don’t control.**

## Quick Start

### Basic Setup (Static Only)

For basic HTML/CSS/JS testing without validation endpoints:

```bash
python3 -m http.server 3000
```

Then open: `http://localhost:3000/home/`

### Recommended Setup (Full Features)

For the complete experience with validation endpoints and progress tracking:

```bash
# Install Vercel CLI (one-time)
npm install -g vercel

# Start dev server
vercel dev
```

Then open: `http://localhost:3000/home/`

**Note:** The validation endpoints require Vercel CLI. Without it, you can still complete labs manually but won't get automated feedback.

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

## Labs Overview

### Tier 1 Labs (Beginner-Friendly)

| Lab ID | Name | Difficulty | Time | Validation |
|--------|------|-----------|------|------------|
| A03-006 | Reflected XSS | Beginner | 10min | ✅ Automated |
| A03-001 | SQLi Error | Beginner | 15min | ✅ Automated |
| A01-001 | IDOR | Beginner | 10min | ✅ Automated |
| STORAGE-001 | LocalStorage Leak | Beginner | 5min | ✅ Automated |
| A02-002 | Secret Scanner | Beginner | 15min | ✅ Automated |
| VULN-007 | Git Exposure | Intermediate | 20min | ✅ Automated |
| VULN-008 | Env File Finder | Beginner | 10min | ⚠️ Manual |

### Additional Labs

| Lab ID | Name | Difficulty | Time | Validation |
|--------|------|-----------|------|------------|
| A05-006 | CORS Misconfiguration | Intermediate | 25min | ✅ Automated |
| VULN-004 | File Upload | Intermediate | 30min | ✅ Automated |
| INPUT-001 | Input Validation | Intermediate | 20min | ✅ Automated |
| HEADER-001 | Security Headers | Intermediate | 15min | ✅ Automated |

**Legend:**
- ✅ Automated = Server-side validation with instant feedback
- ⚠️ Manual = Self-validation required

## Validation System

Each lab with automated validation has a server-side endpoint that checks your exploitation attempts:

### How It Works

1. **Submit Your Payload:** Enter your exploit in the lab interface
2. **Click "Validate Solution":** Triggers server-side validation
3. **Get Instant Feedback:**
   - ✅ Success: Explanation + next steps
   - ❌ Failed: Helpful hints based on what's missing
4. **Track Progress:** Successful completions saved to localStorage

### Example Validation Response

```json
{
  "success": true,
  "message": "🎯 XSS vulnerability successfully exploited!",
  "explanation": "Your payload contains executable JavaScript that would run in the victim's browser.",
  "nextSteps": "Try exploring stored XSS vulnerabilities or attempt to bypass CSP headers.",
  "points": 100
}
```

### Validation Endpoints

All validation endpoints follow the pattern: `/api/validate/{lab-id}`

Example: `/api/validate/xss-reflected?payload=<img src=x onerror=alert(1)>`

## API Endpoints

The platform includes 50+ mock API endpoints for testing:

### Core Endpoints
- `/api/headers` - Header manipulation testing
- `/api/cookies` - Cookie security testing
- `/api/methods` - HTTP method testing
- `/api/reflect` - XSS reflection endpoint
- `/api/sql` - SQL injection testing
- `/api/cors` - CORS misconfiguration demo

### Authentication
- `/api/auth/login` - Login endpoint with weak validation
- `/api/auth/reset` - Password reset with predictable tokens
- `/api/auth/session` - Session management testing

### Validation (10 endpoints)
- `/api/validate/xss-reflected`
- `/api/validate/sqli-error`
- `/api/validate/idor`
- `/api/validate/localstorage`
- `/api/validate/secret-scanner`
- `/api/validate/git-exposure`
- `/api/validate/cors`
- `/api/validate/upload`
- `/api/validate/input-validation`
- `/api/validate/security-headers`

## Testing & Quality

### Test Results

**Status:** ✅ All systems operational (100% pass rate)

**Last Tested:** January 2026
**Test Coverage:** Phase 1-3 features
**Critical Bugs:** 0 remaining

See `test-results/FINAL-TEST-REPORT.md` for detailed test results.

### Recent Fixes

- ✅ Fixed 41 backend module paths (`server/api 2/` directory structure)
- ✅ Validated XSS endpoint with real payloads
- ✅ Implemented mobile sidebar with toggle, auto-close, and backdrop
- ✅ Added nav link auto-close behavior on mobile
- ✅ Fixed mobile initialization to always start collapsed

## Educational Guide

See `GUIDE.md` for the training approach, topic map, and recommended learning flow.
See `ROADMAP.md` for a 10+ ideas-per-section upgrade plan.

## Technology Stack

### Frontend
- **HTML5/CSS3** - Semantic markup with modern styling
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **CSS Grid & Flexbox** - Responsive layouts
- **LocalStorage API** - Client-side progress tracking

### Backend
- **Vercel Serverless Functions** - Node.js API endpoints
- **CommonJS** - Module system for API handlers

### Styling
- **CSS Custom Properties** - Theme variables for consistent design
- **Mobile-First Design** - Responsive breakpoint at 980px
- **Transform Animations** - 60fps sidebar transitions

### Development
- **Vercel CLI** - Local development server
- **Chrome DevTools** - Testing and debugging
- **Git** - Version control

## Browser Support

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Requirements:**
- CSS Grid support
- Flexbox support
- ES6+ JavaScript
- LocalStorage API
- Fetch API

## Safety Notes

### ⚠️ Critical Security Warnings

This platform is **intentionally vulnerable** and contains:

- **Exposed Secrets:** Mock API keys, tokens, and credentials in source code
- **Weak Authentication:** Predictable tokens, no rate limiting, SQL injection
- **Client-Side Vulnerabilities:** XSS, DOM manipulation, localStorage leaks
- **Misconfigured Security:** CORS wildcards, missing CSP, weak headers
- **Information Disclosure:** `.git` artifacts, `.env` files, stack traces
- **Dangerous Patterns:** `eval()`, `innerHTML`, unsanitized inputs

### Safe Usage Guidelines

✅ **DO:**
- Use in isolated, local development environments
- Deploy to clearly labeled training subdomains (e.g., `training.example.com`)
- Keep deployments behind authentication or VPN
- Use for educational purposes only
- Study the vulnerabilities to learn secure coding practices

❌ **DO NOT:**
- Deploy to production infrastructure
- Use on public internet without isolation
- Reuse code patterns in real applications
- Store real user data or credentials
- Connect to production databases or APIs

### Legal & Ethical Use

This platform is designed for:
- Security training and education
- Authorized penetration testing practice
- CTF-style challenges in controlled environments
- Academic coursework in cybersecurity

**Not authorized for:**
- Attacking systems without explicit permission
- Bypassing security controls in production systems
- Circumventing access controls on live websites

## Development

### Project Structure

```
├── api/                    # Serverless function router
├── server/api 2/          # API endpoint handlers (Note: space in "api 2")
├── assets/                # Global CSS and JavaScript
│   ├── app.js            # Main application logic
│   ├── styles.css        # Global styles and theme
│   └── lab-content.js    # Educational content system
├── data/                  # JSON data files
│   ├── lab-content.json  # Lab educational content
│   └── lab-metadata.json # Lab difficulty and categories
├── labs/                  # Vulnerability lab pages
├── home/                  # Main dashboard
├── owasp/                # OWASP Top 10 category pages
├── auth/                 # Authentication labs
├── api-labs/             # API testing pages
├── test-results/         # Test reports and screenshots
└── README.md             # This file
```

### Adding a New Lab

1. **Create the lab HTML:** `labs/my-new-lab.html`
2. **Add educational content:** Update `data/lab-content.json`
3. **Add metadata:** Update `data/lab-metadata.json`
4. **Create validation endpoint:** `server/api 2/validate/my-new-lab.js`
5. **Register endpoint:** Add to `api/index.js` handlers object
6. **Add to home page:** Link from `home/index.html`
7. **Test validation:** Run `vercel dev` and test endpoint

### Development Tips

- **Module Paths:** Remember the space in `server/api 2/` when requiring modules
- **Hot Reload:** Vercel dev server auto-reloads on file changes
- **Testing:** Use Chrome DevTools for debugging and mobile testing
- **Validation:** Test validation endpoints with various payloads
- **Mobile:** Resize viewport to ≤980px to test mobile sidebar

## Contributing

Contributions are welcome! Areas for improvement:

- Additional vulnerability labs (stored XSS, CSRF, XXE, etc.)
- More detailed educational content
- Enhanced validation logic
- Additional hint levels
- New API endpoints
- Improved mobile UX
- Accessibility improvements
- Performance optimizations

## Screenshots

### Desktop View - Home Dashboard
- Progress tracking with completion stats
- Search and filter functionality
- Lab cards with difficulty badges and time estimates

### Mobile View - Collapsible Sidebar
- Hamburger menu with smooth slide-in animation
- Backdrop overlay with blur effect
- Auto-close on navigation for better UX

### Lab Page - Educational Content
- What/Why/How explanations for each vulnerability
- Progressive 3-tier hint system
- Code comparison (vulnerable vs. secure)
- Validation with instant feedback

**View test screenshots:** `test-results/` directory contains 20+ screenshots documenting all features.

## Quick Links

- 📖 **Full Test Report:** [test-results/FINAL-TEST-REPORT.md](test-results/FINAL-TEST-REPORT.md)
- 🎯 **Lab Content:** [data/lab-content.json](data/lab-content.json)
- 📊 **Lab Metadata:** [data/lab-metadata.json](data/lab-metadata.json)
- 🏠 **Main Dashboard:** Open `/home/` after starting server
- 🔬 **First Lab:** Start with Reflected XSS at `/labs/xss-reflected.html`

## Project Stats

- **Total Labs:** 12+ vulnerability labs
- **Validation Endpoints:** 10 automated
- **API Endpoints:** 50+ mock endpoints
- **Code Size:** ~15,000 lines (HTML/CSS/JS/Node)
- **Test Coverage:** 100% pass rate on core features
- **Mobile Support:** Fully responsive with dedicated mobile UX

## Acknowledgments

Built for educational purposes to support:
- Security awareness training
- Hands-on vulnerability research
- OWASP Top 10 learning paths
- Mobile penetration testing practice
- CTF-style challenges

## License

Use at your own risk for educational purposes only.

**Disclaimer:** This software is provided for educational purposes. The authors are not responsible for misuse or damage caused by this software. Always obtain proper authorization before testing security vulnerabilities.

---

**VulnLab Academy** - Learn by Breaking, Secure by Understanding 🔒
