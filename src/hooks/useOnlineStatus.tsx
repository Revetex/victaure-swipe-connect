
import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useOnlineStatus() {
  const { user } = useAuth();
  const channelRef = useRef<any>(null);

  const updateOnlineStatus = useCallback(async (status: boolean) => {
    if (!user?.id) return;

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
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    let mounted = true;

    const channel = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        if (!mounted) return;
        const newState = channel.presenceState();
        console.log('Online users:', newState);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        if (!mounted) return;
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        if (!mounted) return;
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED' || !mounted) return;

        try {
          await updateOnlineStatus(true);
          await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Error in subscription:', error);
        }
      });

    channelRef.current = channel;

    // Update online status when tab visibility changes
    const handleVisibilityChange = () => {
      updateOnlineStatus(!document.hidden);
    };

    // Update online status when window is closing
    const handleBeforeUnload = () => {
      updateOnlineStatus(false);
    };

    // Handle when device goes online/offline
    const handleOnline = () => updateOnlineStatus(true);
    const handleOffline = () => updateOnlineStatus(false);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial online status
    updateOnlineStatus(true);

    return () => {
      mounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (channelRef.current) {
        updateOnlineStatus(false);
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user?.id, updateOnlineStatus]);
}
