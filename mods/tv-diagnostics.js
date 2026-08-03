const PANEL_ID = 'tflix-tv-diagnostics';
let keyCount = 0;
let lastKey = 'waiting for remote input';

function renderPanel() {
  if (!document.documentElement) return;

  let panel = document.getElementById(PANEL_ID);
  if (!panel) {
    panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.style.cssText = [
      'position:fixed',
      'top:12px',
      'left:12px',
      'z-index:2147483647',
      'padding:12px 16px',
      'background:#071a0f',
      'border:3px solid #36ff78',
      'border-radius:6px',
      'color:#fff',
      'font:20px/1.35 monospace',
      'white-space:pre',
      'pointer-events:none'
    ].join(';');
    document.documentElement.appendChild(panel);
  }

  panel.textContent = `TFLIX TEST ACTIVE v1.4.3-test.2\nkeys: ${keyCount}\nlast: ${lastKey}`;
}

function handleDiagnosticKey(event) {
  keyCount += 1;
  lastKey = `${event.key || 'unknown'} / ${event.keyCode || event.which || 0}`;
  renderPanel();
}

// Capture at window level before Cineby's handlers can stop propagation.
window.addEventListener('keydown', handleDiagnosticKey, true);

if (document.documentElement) {
  renderPanel();
} else {
  document.addEventListener('DOMContentLoaded', renderPanel, { once: true });
}
