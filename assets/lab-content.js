/**
 * Lab Content Injection System
 * Provides educational content, hints, and code comparisons for vulnerability labs
 */

(function() {
  'use strict';

  // Helper to escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Render "What is this vulnerability?" section
  function renderWhatSection(what) {
    if (!what) return '';
    return `
      <details open>
        <summary><strong>📘 What is this vulnerability?</strong></summary>
        <p>${escapeHtml(what)}</p>
      </details>
    `;
  }

  // Render "Why does it matter?" section
  function renderWhySection(why, impact) {
    if (!why) return '';
    return `
      <details open>
        <summary><strong>⚠️ Why is this dangerous?</strong></summary>
        <p>${escapeHtml(why)}</p>
        ${impact ? `<p class="impact-badge"><strong>Impact:</strong> ${escapeHtml(impact)}</p>` : ''}
      </details>
    `;
  }

  // Render step-by-step exploitation guide
  function renderStepsSection(steps) {
    if (!steps || steps.length === 0) return '';

    const stepsList = steps.map((step, index) =>
      `<li>${escapeHtml(step)}</li>`
    ).join('');

    return `
      <details>
        <summary><strong>🔍 How to exploit this</strong></summary>
        <ol class="exploitation-steps">
          ${stepsList}
        </ol>
      </details>
    `;
  }

  // Render progressive hint system
  function renderHintSystem(hints) {
    if (!hints || hints.length === 0) return '';

    const hintElements = hints.map((hint, index) => {
      const level = index + 1;
      const levelClass = `hint-level-${level}`;
      const levelLabel = level === 1 ? 'Beginner' : level === 2 ? 'Intermediate' : 'Solution';

      return `
        <details class="${levelClass}">
          <summary>💡 Hint ${level} (${levelLabel})</summary>
          <p>${escapeHtml(hint.text)}</p>
        </details>
      `;
    }).join('');

    return `
      <div class="hint-system">
        <div class="hint-header">Need help? Click for progressive hints</div>
        ${hintElements}
      </div>
    `;
  }

  // Render secure vs insecure code comparison
  function renderCodeComparison(fix) {
    if (!fix || !fix.insecure || !fix.secure) return '';

    return `
      <details>
        <summary><strong>🛡️ How to fix this vulnerability</strong></summary>
        <div class="code-comparison">
          <div class="code-block insecure">
            <h4>❌ Vulnerable Code</h4>
            <pre><code>${escapeHtml(fix.insecure)}</code></pre>
          </div>
          <div class="code-block secure">
            <h4>✅ Secure Code</h4>
            <pre><code>${escapeHtml(fix.secure)}</code></pre>
          </div>
        </div>
      </details>
    `;
  }

  // Render related labs suggestions
  function renderRelatedLabs(related) {
    if (!related || related.length === 0) return '';

    const labLinks = related.map(labId =>
      `<a href="/labs/${labId}.html" class="related-lab-badge">${labId}</a>`
    ).join('');

    return `
      <div class="related-labs">
        <h4>🔗 Related Labs</h4>
        <div class="lab-links">${labLinks}</div>
      </div>
    `;
  }

  // Main function to attach lab content
  window.attachLabContent = async function(labId, options) {
    options = options || {};
    const targetSelector = options.targetSelector || '.lab';
    const position = options.position || 'prepend';

    // Load lab content from JSON
    let labContent;
    try {
      const response = await fetch('/data/lab-content.json');
      const allContent = await response.json();
      labContent = allContent[labId];
    } catch (error) {
      console.error('Failed to load lab content:', error);
      return;
    }

    if (!labContent) {
      console.warn(`No content found for lab: ${labId}`);
      return;
    }

    // Build the complete lab explanation HTML
    const explanationHTML = `
      <div class="lab-explanation">
        <h3 class="explanation-title">📚 Learn About This Vulnerability</h3>

        ${renderWhatSection(labContent.what)}
        ${renderWhySection(labContent.why, labContent.impact)}
        ${renderStepsSection(labContent.steps)}
        ${renderCodeComparison(labContent.fix)}

        ${renderHintSystem(labContent.hints)}
        ${renderRelatedLabs(labContent.related)}
      </div>
    `;

    // Find target element and inject content
    const targetElement = document.querySelector(targetSelector);
    if (!targetElement) {
      console.warn(`Target element not found: ${targetSelector}`);
      return;
    }

    // Create a container for the content
    const container = document.createElement('div');
    container.innerHTML = explanationHTML;

    // Insert based on position
    if (position === 'prepend') {
      targetElement.insertBefore(container.firstElementChild, targetElement.firstChild);
    } else if (position === 'append') {
      targetElement.appendChild(container.firstElementChild);
    } else if (position === 'before') {
      targetElement.parentElement.insertBefore(container.firstElementChild, targetElement);
    } else if (position === 'after') {
      targetElement.parentElement.insertBefore(
        container.firstElementChild,
        targetElement.nextSibling
      );
    }
  };

  // Helper function to track hint views (for analytics)
  window.trackHintView = function(labId, hintLevel) {
    try {
      const hints = JSON.parse(localStorage.getItem('hint-views') || '{}');
      if (!hints[labId]) hints[labId] = [];
      if (!hints[labId].includes(hintLevel)) {
        hints[labId].push(hintLevel);
        localStorage.setItem('hint-views', JSON.stringify(hints));
      }
    } catch (e) {
      console.error('Failed to track hint view:', e);
    }
  };

  // Auto-track hint views when details are opened
  document.addEventListener('click', function(e) {
    if (e.target.tagName === 'SUMMARY' && e.target.closest('.hint-system')) {
      const details = e.target.parentElement;
      if (details.hasAttribute('data-lab-id') && details.hasAttribute('data-hint-level')) {
        const labId = details.getAttribute('data-lab-id');
        const hintLevel = details.getAttribute('data-hint-level');
        trackHintView(labId, hintLevel);
      }
    }
  });

})();
