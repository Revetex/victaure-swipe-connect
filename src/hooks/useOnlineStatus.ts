
/**
 * Hook pour surveiller l'état de la connexion Internet de l'utilisateur
 */
import { useState, useEffect } from 'react';

interface OnlineStatusOptions {
  pollingInterval?: number; // Intervalle de vérification en ms
  pingTimeout?: number; // Délai d'attente en ms avant d'échec du ping
  pingUrl?: string; // URL à "pinger" pour vérifier la connectivité
}

export function useOnlineStatus(options: OnlineStatusOptions = {}) {
  const {
    pollingInterval = 30000, // 30 secondes par défaut
    pingTimeout = 5000, // 5 secondes par défaut
    pingUrl = 'https://mfjllillnpleasclqabb.supabase.co/storage/v1/object/health' // Point de terminaison fiable
  } = options;
  
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Fonction pour vérifier activement la connectivité
  const checkConnection = async (): Promise<boolean> => {
    setIsChecking(true);
    
    try {
      // Configuration du timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), pingTimeout);
      
      // Tentative de ping d'un service
      const response = await fetch(pingUrl, {
        method: 'HEAD', // Utilise HEAD pour minimiser la bande passante
        mode: 'no-cors', // Mode no-cors pour éviter les problèmes CORS
        cache: 'no-store', // Évite le cache
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      setIsChecking(false);
      setLastChecked(new Date());
      
      // Si la requête a réussi, l'utilisateur est en ligne
      setIsOnline(true);
      return true;
    } catch (error) {
      console.log('Vérification de connexion échouée:', error);
      setIsChecking(false);
      setLastChecked(new Date());
      
      // Si la requête a échoué, l'utilisateur est hors ligne
      setIsOnline(false);
      return false;
    }
  };

  // Gestionnaires d'événements pour les changements de l'état en ligne/hors ligne du navigateur
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkConnection(); // Double vérification pour confirmer
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    // Ajoute les écouteurs d'événements
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Vérifie la connexion au montage
    checkConnection();
    
    // Configure la vérification périodique
    const intervalId = setInterval(checkConnection, pollingInterval);
    
    // Nettoie au démontage
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [pollingInterval, pingUrl, pingTimeout]);

  return {
    isOnline,
    isChecking,
    lastChecked,
    checkConnection
  };
}
