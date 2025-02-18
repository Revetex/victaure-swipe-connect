
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/profile';
import { toast } from "sonner";

export const usePresenceTracking = (profile: UserProfile | null) => {
  useEffect(() => {
    if (!profile) return;

    let mounted = true;
    const presenceChannel = supabase.channel('online_users');
    
    const updatePresence = async (status: boolean) => {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            online_status: status,
            last_seen: status ? null : new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id);

        if (error) {
          console.error('Error updating presence:', error);
          toast.error("Erreur lors de la mise à jour du statut");
        }
      } catch (error) {
        console.error('Error in updatePresence:', error);
      }
    };

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        console.log('Presence sync:', state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && mounted) {
          await updatePresence(true);
          await presenceChannel.track({
            user_id: profile.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    // Gestionnaires d'événements pour la visibilité et la connexion
    const handleVisibilityChange = () => {
      updatePresence(!document.hidden);
    };

    const handleOnline = () => updatePresence(true);
    const handleOffline = () => updatePresence(false);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Nettoyage
    return () => {
      mounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      updatePresence(false).then(() => {
        supabase.removeChannel(presenceChannel);
      });
    };
  }, [profile]);
};
