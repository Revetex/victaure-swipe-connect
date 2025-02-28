
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Hook pour suivre et mettre à jour le statut en ligne de l'utilisateur
 */
export function useOnlineStatus() {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    if (!user) return;

    // Marquer l'utilisateur comme en ligne
    const updateOnlineStatus = async (status: boolean) => {
      try {
        await supabase
          .from('profiles')
          .update({ 
            online_status: status,
            last_seen: status ? null : new Date().toISOString()
          })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error updating online status:', error);
      }
    };

    // Gestionnaires d'événements pour le statut en ligne
    const handleOnline = () => {
      setIsOnline(true);
      updateOnlineStatus(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      updateOnlineStatus(false);
    };

    // Définir en ligne initialement
    updateOnlineStatus(navigator.onLine);

    // Écouter les événements de navigateur
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // S'assurer que le statut est mis à jour lorsque l'utilisateur quitte la page
    const handleBeforeUnload = () => {
      updateOnlineStatus(false);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Mettre à jour le statut en ligne avec une heartbeat
    const heartbeatInterval = setInterval(() => {
      if (navigator.onLine) {
        updateOnlineStatus(true);
      }
    }, 60000); // Heartbeat toutes les minutes

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(heartbeatInterval);
      
      // Marquer hors ligne lors du démontage
      updateOnlineStatus(false);
    };
  }, [user]);

  return isOnline;
}
