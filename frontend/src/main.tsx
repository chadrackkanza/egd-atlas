import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { loadRuntimeConfig } from './lib/config.ts';

// Chargement de la configuration d’exécution avant le rendu de l’application.
async function initializeApp() {
  // Les pages de blog pré-rendues sont servies en HTML statique pour le SEO.
  // On évite intentionnellement le montage React afin de conserver un rendu
  // léger et autonome pour les robots d’indexation, sans hydratation côté client.
  if (
    document
      .querySelector('meta[name="prerender-static-page"]')
      ?.getAttribute('content') === 'blog'
  ) {
    return;
  }

  try {
    await loadRuntimeConfig();
    console.log('Configuration d’exécution chargée avec succès');
  } catch (error) {
    console.warn(
      'Échec du chargement de la configuration d’exécution, utilisation des valeurs par défaut :',
      error
    );
  }

  console.log('Montage de l’application React...');
  // Rendu de l’application.
  try {
    createRoot(document.getElementById('root')!).render(<App />);
    // Notifie le serveur qu’une tentative de montage a été effectuée.
    fetch('/api/client-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'mount', message: 'React mount attempted' }),
    }).catch(() => {});
  } catch (err) {
    // Signale l’erreur au backend à des fins de diagnostic.
    fetch('/api/client-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'mount-error', error: String(err) }),
    }).catch(() => {});
    throw err;
  }

  // Gestionnaires globaux pour transmettre les erreurs au backend.
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

// Initialisation de l’application.
initializeApp();
