// Configuration d’exécution.
let runtimeConfig: {
  API_BASE_URL: string;
} | null = null;

// État du chargement de la configuration.
let configLoading = true;

// Configuration de secours par défaut.
const defaultConfig = {
  API_BASE_URL: 'http://127.0.0.1:8000', // Utilisée uniquement si le chargement de configuration échoue.
};

// Fonction de chargement de la configuration d’exécution.
export async function loadRuntimeConfig(): Promise<void> {
  const runtimeConfigEnabled =
    import.meta.env.PROD ||
    import.meta.env.VITE_RUNTIME_CONFIG_ENABLED === 'true';

  if (!runtimeConfigEnabled) {
    console.log(
      'Chargement de la configuration d’exécution ignoré en développement local ; utilisation de la configuration Vite ou des valeurs par défaut.'
    );
    configLoading = false;
    return;
  }

  try {
    console.log('🔧 DEBUG : démarrage du chargement de la configuration d’exécution...');
    // Tentative de chargement de la configuration depuis un endpoint dédié.
    const response = await fetch('/api/config');
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      // On ne parse le JSON que si la réponse est réellement au format JSON.
      if (contentType && contentType.includes('application/json')) {
        runtimeConfig = await response.json();
        console.log('Configuration d’exécution chargée avec succès');
      } else {
        console.log(
          'Le point d’accès de configuration a renvoyé une réponse non JSON ; chargement de la configuration d’exécution ignoré'
        );
      }
    } else {
      console.log(
        '🔧 DEBUG : échec du chargement de la configuration avec le statut :',
        response.status
      );
    }
  } catch (error) {
    console.log('Échec du chargement de la configuration d’exécution, utilisation des valeurs par défaut :', error);
  } finally {
    configLoading = false;
    console.log(
      '🔧 DEBUG : chargement de la configuration terminé, configLoading défini à false'
    );
  }
}

// Récupération de la configuration actuelle.
export function getConfig() {
  // Si la configuration est encore en cours de chargement, on retourne la configuration par défaut pour éviter d’utiliser des variables Vite obsolètes.
  if (configLoading) {
    console.log('Configuration encore en cours de chargement, utilisation de la configuration par défaut');
    return defaultConfig;
  }

  // Essai prioritaire de la configuration d’exécution (pour Lambda).
  if (runtimeConfig) {
    console.log('Utilisation de la configuration d’exécution');
    return runtimeConfig;
  }

  // Puis tentative d’utilisation des variables d’environnement Vite (développement local).
  if (import.meta.env.VITE_API_BASE_URL) {
    const viteConfig = {
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    };
    console.log('Utilisation de la configuration fournie par l’environnement Vite');
    return viteConfig;
  }

  // Enfin, retour à la configuration par défaut.
  console.log('Utilisation de la configuration par défaut');
  return defaultConfig;
}

// Getter dynamique de API_BASE_URL : il renvoie toujours la configuration actuelle.
export function getAPIBaseURL(): string {
  const baseURL = getConfig().API_BASE_URL;
  // Si l’URL de base vaut '/', on retourne une chaîne vide pour éviter les doubles slashs et un préfixe http:// incorrect.
  if (baseURL === '/') {
    return '';
  }
  return baseURL;
}

// Conservé pour compatibilité ascendante, mais à éviter si possible.
// Export statique retiré pour éviter des valeurs de configuration obsolètes.
// export const API_BASE_URL = getAPIBaseURL();

export const config = {
  get API_BASE_URL() {
    return getAPIBaseURL();
  },
};
