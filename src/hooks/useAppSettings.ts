
/**
 * Hook pour gérer les paramètres globaux de l'application
 * avec persistance dans le localStorage
 */
import { useState, useEffect, useCallback } from 'react';

// Types des paramètres de l'application
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'fr' | 'en';
  notificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  soundEffectsEnabled: boolean;
  autoSaveInterval: number; // En secondes
  showOfflineIndicator: boolean;
  debugMode: boolean;
  animations: boolean;
  compactMode: boolean;
  [key: string]: any; // Pour permettre d'autres paramètres personnalisés
}

// Paramètres par défaut
const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  language: 'fr',
  notificationsEnabled: true,
  pushNotificationsEnabled: true,
  soundEffectsEnabled: true,
  autoSaveInterval: 60,
  showOfflineIndicator: true,
  debugMode: false,
  animations: true,
  compactMode: false
};

// Clé de stockage dans le localStorage
const STORAGE_KEY = 'victaure_app_settings';

export function useAppSettings() {
  // Initialise l'état avec les paramètres stockés ou les valeurs par défaut
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Récupère les paramètres du localStorage s'ils existent
    if (typeof window !== 'undefined') {
      try {
        const storedSettings = localStorage.getItem(STORAGE_KEY);
        if (storedSettings) {
          // Fusionne les paramètres stockés avec les valeurs par défaut pour s'assurer que tous les champs existent
          return {
            ...DEFAULT_SETTINGS,
            ...JSON.parse(storedSettings)
          };
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      }
    }
    
    return DEFAULT_SETTINGS;
  });

  // Met à jour un seul paramètre
  const updateSetting = useCallback(<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings(prev => {
      const updatedSettings = {
        ...prev,
        [key]: value
      };
      
      // Persiste dans le localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
      }
      
      return updatedSettings;
    });
  }, []);

  // Met à jour plusieurs paramètres à la fois
  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updatedSettings = {
        ...prev,
        ...newSettings
      };
      
      // Persiste dans le localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
      }
      
      return updatedSettings;
    });
  }, []);

  // Réinitialise tous les paramètres aux valeurs par défaut
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    
    // Persiste dans le localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    }
  }, []);

  // Applique les paramètres au chargement initial
  useEffect(() => {
    // Applique le thème
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Mode système - écoute les préférences du système
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const applyTheme = (e: MediaQueryListEvent | MediaQueryList) => {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      };
      
      // Applique initialement
      applyTheme(darkModeMediaQuery);
      
      // Écoute les changements
      darkModeMediaQuery.addEventListener('change', applyTheme);
      
      return () => {
        darkModeMediaQuery.removeEventListener('change', applyTheme);
      };
    }
  }, [settings.theme]);

  // Retourne les paramètres et les fonctions de mise à jour
  return {
    settings,
    updateSetting,
    updateSettings,
    resetSettings
  };
}
