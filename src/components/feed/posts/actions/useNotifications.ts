
import { supabase } from "@/integrations/supabase/client";

export const useNotifications = () => {
  const createNotification = async (userId: string, title: string, message: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
        });

      if (error) throw error;

      // Send push notification if the user has enabled them
      const { data: profile } = await supabase
        .from('profiles')
        .select('push_token, push_notifications_enabled')
        .eq('id', userId)
        .single();

      if (profile?.push_notifications_enabled && profile?.push_token) {
        await supabase.functions.invoke('push-notification', {
          body: {
            subscription: JSON.parse(profile.push_token),
            title,
            message
          }
        });
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  return { createNotification };
};
