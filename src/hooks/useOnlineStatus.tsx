
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
          last_seen: new Date().toISOString()
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

    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateOnlineStatus(false);
      } else {
        updateOnlineStatus(true);
      }
    };

    const handleBeforeUnload = () => {
      updateOnlineStatus(false);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      mounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      if (channelRef.current) {
        updateOnlineStatus(false);
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user?.id, updateOnlineStatus]);
}
