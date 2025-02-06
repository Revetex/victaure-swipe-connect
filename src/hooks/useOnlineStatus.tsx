
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useOnlineStatus() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        console.log('Online users:', newState);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;

        try {
          // Update user's online status
          await supabase
            .from('profiles')
            .update({
              online_status: true,
              last_seen: new Date().toISOString()
            })
            .eq('id', user.id);

          // Track presence
          await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Error updating online status:', error);
        }
      });

    // Update last_seen and online_status when user leaves/closes tab
    const handleTabClose = async () => {
      try {
        await supabase
          .from('profiles')
          .update({
            online_status: false,
            last_seen: new Date().toISOString()
          })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error updating offline status:', error);
      }
    };

    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
      supabase.removeChannel(channel);
    };
  }, [user?.id]);
}
