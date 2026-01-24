// Global variables for recon scripts
window.APP_CONFIG = {
  env: "development",
  apiBase: "/api",
  graphqlEndpoint: "/api/graphql",
  authTokenHint: "sk_live_test_123456",
  endpoints: ["/api/users", "/api/orders", "/api/search", "/api/admin"],
  featureFlags: { betaCheckout: true, debugPanels: true }
};

window.__SECRET_KEY__ = "test-secret-key-DO-NOT-USE";
window.LegacyApp = {
  version: "0.8.2",
  ownerEmail: "ops@vulnerable-labs.local",
  supportPhone: "+1-415-555-0199",
  adminEndpoint: "/admin/console"
};

// Populate storage with intentionally sensitive data
try {
  localStorage.setItem("auth_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImV4cCI6MTk5OTk5OTk5OX0.fake-signature");
  localStorage.setItem("profile", JSON.stringify({ id: 1, email: "alice@example.com", role: "admin" }));
  sessionStorage.setItem("cart", JSON.stringify([{ id: 101, name: "Zero Trust Hoodie", price: 1.0, qty: 2 }]));
} catch (e) {
  // Ignore storage errors in private modes
}

// Service worker registration for analysis
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

// Expose some suspicious helper functions
window.renderRawHtml = function (targetId, html) {
  var el = document.getElementById(targetId);
  if (el) {
    el.innerHTML = html;
  }
};

window.evalUserCode = function (code) {
  return eval(code); // Intentionally unsafe for testing
};
//# sourceMappingURL=/assets/app.js.map

function attachLabTooltips() {
  var blocks = document.querySelectorAll('.lab, .card');
  blocks.forEach(function (block) {
    var title = block.querySelector('h3');
    var desc = block.querySelector('p') || block.querySelector('.notice');
    if (!title || !desc) return;
    if (title.querySelector('.info-tip')) return;
    var text = (desc.textContent || '').trim();
    if (!text) return;
    var tip = document.createElement('span');
    tip.className = 'info-tip';
    tip.setAttribute('data-tip', text);
    tip.setAttribute('aria-label', text);
    tip.textContent = 'Info';
    tip.tabIndex = 0;
    tip.addEventListener('click', function (e) {
      e.stopPropagation();
      tip.classList.toggle('is-open');
    });
    tip.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tip.classList.toggle('is-open');
      }
    });
    title.appendChild(tip);
  });
}

document.addEventListener('click', function () {
  document.querySelectorAll('.info-tip.is-open').forEach(function (el) {
    el.classList.remove('is-open');
  });
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attachLabTooltips);
} else {
  attachLabTooltips();
}

function setupSidebarToggle() {
  var sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;
  var body = document.body;

  if (!sidebar.hasAttribute('data-resource-skip') && !sidebar.querySelector('a[href=\"/resource/\"]')) {
    var navGroup = sidebar.querySelector('.nav-group');
    if (navGroup) {
      var resourceLink = document.createElement('a');
      resourceLink.href = '/resource/';
      resourceLink.textContent = 'Resource Hub';
      navGroup.appendChild(resourceLink);
    }
  }

  if (!sidebar.querySelector('.sidebar-toggle')) {
    var btn = document.createElement('button');
    btn.className = 'sidebar-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Toggle sidebar');
    btn.textContent = '☰';
    sidebar.insertBefore(btn, sidebar.firstChild);
  }

  var fab = document.querySelector('.sidebar-fab');
  if (!fab) {
    fab = document.createElement('button');
    fab.className = 'sidebar-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Open sidebar');
    fab.textContent = '☰';
    document.body.appendChild(fab);
  }

  var backdrop = document.querySelector('.sidebar-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);
  }

  function setCollapsed(state) {
    body.classList.toggle('sidebar-collapsed', state);
    if (window.innerWidth <= 980) {
      body.classList.toggle('sidebar-open', !state);
    } else {
      body.classList.remove('sidebar-open');
    }
    try { localStorage.setItem('sidebar-collapsed', String(state)); } catch (e) {}
  }

  function toggle() {
    var collapsed = body.classList.contains('sidebar-collapsed');
    setCollapsed(!collapsed);
  }

  var stored = null;
  try { stored = localStorage.getItem('sidebar-collapsed'); } catch (e) {}
  var initialCollapsed = stored === 'true';
  if (stored === null && window.innerWidth <= 980) {
    initialCollapsed = true;
  }
  setCollapsed(initialCollapsed);

  sidebar.querySelector('.sidebar-toggle').addEventListener('click', function (e) {
    e.stopPropagation();
    toggle();
  });
  fab.addEventListener('click', function (e) {
    e.stopPropagation();
    setCollapsed(false);
  });
  backdrop.addEventListener('click', function () {
    setCollapsed(true);
  });

  window.addEventListener('resize', function () {
    var collapsed = body.classList.contains('sidebar-collapsed');
    if (window.innerWidth > 980) {
      body.classList.remove('sidebar-open');
      if (!collapsed && stored === 'true') setCollapsed(true);
    } else {
      if (!collapsed) body.classList.add('sidebar-open');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupSidebarToggle);
} else {
  setupSidebarToggle();
}

function setupProgressTracker() {
  var boxes = document.querySelectorAll('input[type="checkbox"][data-progress]');
  if (!boxes.length) return;
  var key = 'vulnlab-progress';
  var state = {};
  try { state = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) {}

  function updateSummary() {
    var total = boxes.length;
    var done = 0;
    boxes.forEach(function (cb) { if (cb.checked) done += 1; });
    var summary = document.querySelector('[data-progress-summary]');
    if (summary) summary.textContent = done + '/' + total + ' complete';
  }

  boxes.forEach(function (cb) {
    var id = cb.getAttribute('data-progress');
    if (state[id]) cb.checked = true;
    cb.addEventListener('change', function () {
      state[id] = cb.checked;
      try { localStorage.setItem(key, JSON.stringify(state)); } catch (e) {}
      updateSummary();
    });
  });

  var reset = document.querySelector('[data-progress-reset]');
  if (reset) {
    reset.addEventListener('click', function () {
      state = {};
      boxes.forEach(function (cb) { cb.checked = false; });
      try { localStorage.removeItem(key); } catch (e) {}
      updateSummary();
    });
  }

  updateSummary();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupProgressTracker);
} else {
  setupProgressTracker();
}

// ============================================================================
// PHASE 1: VISUAL FEEDBACK & NAVIGATION ENHANCEMENTS
// ============================================================================

// Visual Feedback System
function showLoading(element) {
  element.classList.add('loading');
  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';
  spinner.innerHTML = '⏳ Loading...';
  element.appendChild(spinner);
}

function hideLoading(element) {
  element.classList.remove('loading');
  const spinner = element.querySelector('.loading-spinner');
  if (spinner) spinner.remove();
}

function showSuccess(element, message) {
  const banner = document.createElement('div');
  banner.className = 'success-banner';
  banner.innerHTML = `✅ ${message}`;
  element.insertBefore(banner, element.firstChild);

  // Animate in
  setTimeout(() => banner.classList.add('visible'), 10);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 300);
  }, 5000);
}

function showError(element, message) {
  const banner = document.createElement('div');
  banner.className = 'error-banner';
  banner.innerHTML = `❌ ${message}`;
  element.insertBefore(banner, element.firstChild);

  setTimeout(() => banner.classList.add('visible'), 10);
  setTimeout(() => {
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 300);
  }, 5000);
}

function markLabComplete(labId) {
  const completed = JSON.parse(localStorage.getItem('completed-labs') || '[]');
  if (!completed.includes(labId)) {
    completed.push(labId);
    localStorage.setItem('completed-labs', JSON.stringify(completed));

    // Store timestamp
    const timestamps = JSON.parse(localStorage.getItem('lab-timestamps') || '{}');
    timestamps[labId] = new Date().toISOString();
    localStorage.setItem('lab-timestamps', JSON.stringify(timestamps));
  }
}

// Active Navigation Highlighting
function highlightActiveNav() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-group a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath ||
        (href !== '/' && currentPath.startsWith(href))) {
      link.classList.add('active');
    }
  });
}

// Breadcrumb Navigation
function renderBreadcrumbs() {
  const path = window.location.pathname;
  const parts = path.split('/').filter(Boolean);

  if (parts.length === 0) return; // Skip for root

  const breadcrumbs = [{ label: 'Home', url: '/home/' }];

  // Build breadcrumb trail
  let currentPath = '';
  parts.forEach((part, index) => {
    currentPath += '/' + part;
    if (index < parts.length - 1) { // Don't link current page
      breadcrumbs.push({
        label: formatLabel(part),
        url: currentPath + '/'
      });
    } else {
      breadcrumbs.push({
        label: formatLabel(part.replace('.html', '')),
        url: null
      });
    }
  });

  // Create breadcrumb HTML
  const nav = document.createElement('nav');
  nav.className = 'breadcrumbs';
  nav.setAttribute('aria-label', 'Breadcrumb');

  breadcrumbs.forEach((crumb, index) => {
    if (index > 0) {
      const separator = document.createElement('span');
      separator.textContent = ' / ';
      separator.className = 'breadcrumb-separator';
      nav.appendChild(separator);
    }

    if (crumb.url) {
      const link = document.createElement('a');
      link.href = crumb.url;
      link.textContent = crumb.label;
      nav.appendChild(link);
    } else {
      const span = document.createElement('span');
      span.textContent = crumb.label;
      span.className = 'breadcrumb-current';
      nav.appendChild(span);
    }
  });

  // Insert before main content
  const main = document.querySelector('.main');
  if (main) {
    const firstHeading = main.querySelector('h2, h1');
    if (firstHeading) {
      firstHeading.parentElement.insertBefore(nav, firstHeading);
    }
  }
}

function formatLabel(str) {
  return str
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

// Difficulty Badges
async function addDifficultyBadges() {
  try {
    const response = await fetch('/data/lab-metadata.json');
    const metadata = await response.json();

    document.querySelectorAll('[data-lab-id]').forEach(element => {
      const labId = element.getAttribute('data-lab-id');
      const labData = metadata.labs[labId];

      if (!labData) return;

      const title = element.querySelector('h3, h2');
      if (!title || title.querySelector('.difficulty-badge')) return;

      const badgeContainer = document.createElement('span');
      badgeContainer.className = 'lab-badges';

      // Difficulty badge
      const diffBadge = document.createElement('span');
      diffBadge.className = `difficulty-badge ${labData.difficulty}`;
      diffBadge.textContent = labData.difficulty;
      badgeContainer.appendChild(diffBadge);

      // Time estimate
      if (labData.estimatedTime) {
        const timeBadge = document.createElement('span');
        timeBadge.className = 'time-badge';
        timeBadge.textContent = labData.estimatedTime;
        badgeContainer.appendChild(timeBadge);
      }

      title.appendChild(badgeContainer);
    });
  } catch (error) {
    console.warn('Failed to load lab metadata:', error);
  }
}

// Collapsible Nav Groups
function makeNavGroupsCollapsible() {
  document.querySelectorAll('.nav-group').forEach(group => {
    const header = group.querySelector('h2');
    if (!header) return;

    const sectionName = header.textContent.trim();

    header.addEventListener('click', () => {
      group.classList.toggle('collapsed');

      // Save state
      const collapsed = group.classList.contains('collapsed');
      try {
        localStorage.setItem(`nav-collapsed-${sectionName}`, collapsed);
      } catch (e) {}
    });

    // Restore state
    try {
      const saved = localStorage.getItem(`nav-collapsed-${sectionName}`);
      if (saved === 'true') {
        group.classList.add('collapsed');
      }
    } catch (e) {}
  });
}

// Initialize all Phase 1 enhancements
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    highlightActiveNav();
    renderBreadcrumbs();
    addDifficultyBadges();
    makeNavGroupsCollapsible();
  });
} else {
  highlightActiveNav();
  renderBreadcrumbs();
  addDifficultyBadges();
  makeNavGroupsCollapsible();
}

// ============================================================================
// PHASE 3: ENHANCED UX - SEARCH, FILTER, PROGRESS DASHBOARD
// ============================================================================

// Search & Filter System
function initializeLabSearch() {
  const searchInput = document.getElementById('lab-search');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const allLabs = document.querySelectorAll('.card[data-lab-id]');

  if (!searchInput || allLabs.length === 0) return;

  let currentFilter = 'all';
  let currentSearch = '';

  function updateDisplay() {
    let visibleCount = 0;

    allLabs.forEach(lab => {
      const labId = lab.getAttribute('data-lab-id');
      const text = lab.textContent.toLowerCase();

      // Check search match
      const searchMatch = !currentSearch || text.includes(currentSearch);

      // Check filter match
      const filterMatch = currentFilter === 'all' ||
                          text.includes(currentFilter.toLowerCase()) ||
                          lab.classList.contains(currentFilter);

      const shouldShow = searchMatch && filterMatch;
      lab.style.display = shouldShow ? '' : 'none';
      if (shouldShow) visibleCount++;
    });

    updateResultsCount(visibleCount, allLabs.length);
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      updateDisplay();
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      updateDisplay();
    });
  });

  // Initial display
  updateDisplay();
}

function updateResultsCount(visible, total) {
  let countEl = document.getElementById('search-results-count');
  if (!countEl) return;

  if (visible === total) {
    countEl.textContent = '';
  } else {
    countEl.textContent = `Showing ${visible} of ${total} labs`;
  }
}

// Progress Dashboard
async function updateProgressDashboard() {
  const completedLabsEl = document.getElementById('labs-completed');
  const totalLabsEl = document.getElementById('labs-total');
  const percentageEl = document.getElementById('completion-percentage');
  const streakEl = document.getElementById('current-streak');
  const progressBar = document.getElementById('overall-progress-bar');
  const categoryBreakdown = document.getElementById('category-breakdown');

  // Check if dashboard elements exist
  if (!completedLabsEl) return;

  const completed = JSON.parse(localStorage.getItem('completed-labs') || '[]');
  const timestamps = JSON.parse(localStorage.getItem('lab-timestamps') || '{}');

  // Load metadata
  let metadata;
  try {
    const response = await fetch('/data/lab-metadata.json');
    metadata = await response.json();
  } catch (error) {
    console.warn('Failed to load lab metadata:', error);
    return;
  }

  const totalLabs = Object.keys(metadata.labs).length;

  // Update stats
  completedLabsEl.textContent = completed.length;
  totalLabsEl.textContent = totalLabs;

  const percentage = totalLabs > 0 ? Math.round((completed.length / totalLabs) * 100) : 0;
  percentageEl.textContent = percentage + '%';

  // Update progress bar
  if (progressBar) {
    progressBar.style.width = percentage + '%';
  }

  // Calculate streak
  const streak = calculateStreak(timestamps);
  streakEl.textContent = streak;

  // Category breakdown
  if (categoryBreakdown) {
    const categories = {};
    completed.forEach(labId => {
      const labData = metadata.labs[labId];
      if (labData) {
        const cat = labData.category;
        categories[cat] = (categories[cat] || 0) + 1;
      }
    });

    renderCategoryBreakdown(categories, metadata, categoryBreakdown);
  }
}

function calculateStreak(timestamps) {
  const dates = Object.values(timestamps)
    .map(ts => new Date(ts).toDateString())
    .sort()
    .reverse();

  if (dates.length === 0) return 0;

  let streak = 1;
  const today = new Date().toDateString();

  if (dates[0] !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (dates[0] !== yesterday) return 0;
  }

  for (let i = 1; i < dates.length; i++) {
    const current = new Date(dates[i]);
    const previous = new Date(dates[i-1]);
    const diffDays = (previous - current) / 86400000;

    if (diffDays <= 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function renderCategoryBreakdown(categories, metadata, container) {
  container.innerHTML = '<h3>Progress by Category</h3>';

  const categoryTotals = {};
  Object.values(metadata.labs).forEach(lab => {
    const cat = lab.category;
    categoryTotals[cat] = (categoryTotals[cat] || 0) + 1;
  });

  const grid = document.createElement('div');
  grid.className = 'category-grid';

  Object.entries(categoryTotals).forEach(([category, total]) => {
    const completed = categories[category] || 0;
    const percentage = Math.round((completed / total) * 100);

    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `
      <div class="category-name">${category}</div>
      <div class="category-stats">
        <span class="category-completed">${completed}/${total}</span>
        <span class="category-percentage">${percentage}%</span>
      </div>
      <div class="category-progress-bar">
        <div class="category-progress-fill" style="width: ${percentage}%"></div>
      </div>
    `;
    grid.appendChild(card);
  });

  container.appendChild(grid);
}

// Initialize Phase 3 features
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initializeLabSearch();
    updateProgressDashboard();
  });
} else {
  initializeLabSearch();
  updateProgressDashboard();
}
