
import { toast } from 'sonner';

// Fonction utilitaire pour détecter les appareils mobiles
const detectMobileDevice = () => {
  return window.innerWidth < 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const handleAuthError = (error: any, signOut: () => Promise<void>) => {
  console.error('Auth error:', error);
  
  // Détecter si l'utilisateur est sur un appareil mobile
  const isMobileDevice = detectMobileDevice();
  
  if (isRefreshTokenError(error)) {
    console.log('Invalid refresh token, clearing session...');
    signOut();
    return;
  }

  if (error.message.includes('JWT expired')) {
    if (!isMobileDevice) {
      toast.error('Votre session a expiré. Veuillez vous reconnecter.');
    } else {
      // Notification plus simple sur mobile
      toast.error('Session expirée');
    }
    signOut();
  } else if (error.message.includes('No user found')) {
    if (!isMobileDevice) {
      toast.error('Utilisateur non trouvé. Veuillez vous reconnecter.');
    } else {
      toast.error('Utilisateur non trouvé');
    }
    signOut();
  } else {
    if (!isMobileDevice) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } else {
      toast.error("Erreur. Réessayez.");
    }
  }
};

export const isRefreshTokenError = (error: any): boolean => {
  return error.message.includes('refresh_token_not_found') || 
         error.message.includes('Invalid Refresh Token');
};

export const clearStorages = () => {
  localStorage.clear();
  sessionStorage.clear();
  
  // Effacer tous les cookies
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }
};

/**
 * Stocke l'URL actuelle pour rediriger après connexion
 * avec gestion spéciale pour les appareils mobiles
 */
export const saveRedirectUrl = (path: string) => {
  const isMobile = detectMobileDevice();
  
  if (path !== '/auth' && path !== '/login' && path !== '/signup') {
    const storageMethod = isMobile ? localStorage : sessionStorage;
    storageMethod.setItem('redirectTo', path);
  }
};

/**
 * Récupère l'URL de redirection avec support mobile
 */
export const getRedirectUrl = (): string => {
  const isMobile = detectMobileDevice();
  
  // Sur mobile, on cherche d'abord dans localStorage (plus persistant)
  const mobileRedirect = isMobile ? localStorage.getItem('redirectTo') : null;
  return mobileRedirect || sessionStorage.getItem('redirectTo') || '/dashboard';
};

/**
 * Efface l'URL de redirection des deux storages
 */
export const clearRedirectUrl = () => {
  sessionStorage.removeItem('redirectTo');
  localStorage.removeItem('redirectTo');
};

/**
 * Gestion des tentatives de reconnexion adaptée aux mobiles
 */
export const handleReconnection = async (
  authFunction: () => Promise<any>, 
  maxRetries: number = 3
) => {
  const isMobile = detectMobileDevice();
  const retryLimit = isMobile ? 2 : maxRetries; // Moins de tentatives sur mobile
  const retryDelay = isMobile ? 800 : 1000; // Délai plus court sur mobile
  
  let attempts = 0;
  
  while (attempts < retryLimit) {
    try {
      return await authFunction();
    } catch (error) {
      attempts++;
      console.log(`Tentative de reconnexion (${attempts}/${retryLimit})...`);
      
      if (attempts >= retryLimit) throw error;
      
      // Attendre avant la prochaine tentative
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};
