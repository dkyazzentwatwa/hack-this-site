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
