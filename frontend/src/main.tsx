import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { loadRuntimeConfig } from './lib/config.ts';

// Load runtime configuration before rendering the app
async function initializeApp() {
  // Prerendered blog pages are served as pure static HTML for SEO.
  // Intentionally skip React mounting so the crawler-facing markup stays
  // lightweight and self-contained — no client-side hydration needed.
  if (
    document
      .querySelector('meta[name="prerender-static-page"]')
      ?.getAttribute('content') === 'blog'
  ) {
    return;
  }

  try {
    await loadRuntimeConfig();
    console.log('Runtime configuration loaded successfully');
  } catch (error) {
    console.warn(
      'Failed to load runtime configuration, using defaults:',
      error
    );
  }

  console.log('Mounting React app...');
  // Render the app
  try {
    createRoot(document.getElementById('root')!).render(<App />);
    // notify server that mount was attempted
    fetch('/api/client-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'mount', message: 'React mount attempted' }),
    }).catch(() => {});
  } catch (err) {
    // report error to backend for diagnostics
    fetch('/api/client-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'mount-error', error: String(err) }),
    }).catch(() => {});
    throw err;
  }

  // Global handlers to forward errors
  window.addEventListener('error', (e) => {
    try {
      fetch('/api/client-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'error', message: e.message, filename: e.filename, lineno: e.lineno, colno: e.colno }),
      });
    } catch (e) {}
  });

  window.addEventListener('unhandledrejection', (e) => {
    try {
      fetch('/api/client-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'unhandledrejection', reason: String(e.reason) }),
      });
    } catch (e) {}
  });
}

// Initialize the app
initializeApp();
