import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function requestPushPermission() {
  try {
    if (!("Notification" in window)) {
      toast.error("Ce navigateur ne supporte pas les notifications push");
      return false;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Register service worker for push notifications
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Get VAPID public key from Supabase
      const { data: { secret }, error: secretError } = await supabase.rpc('get_secret', {
        secret_name: 'VAPID_PUBLIC_KEY'
      });
      
      if (secretError || !secret) {
        console.error('Error getting VAPID key:', secretError);
        toast.error("Erreur lors de la configuration des notifications");
        return false;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: secret
      });

      // Save subscription to profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('profiles')
        .update({
          push_token: JSON.stringify(subscription),
          push_notifications_enabled: true
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Notifications push activées");
      return true;
    } else {
      toast.error("Permission de notification refusée");
      return false;
    }
  } catch (error) {
    console.error('Error setting up push notifications:', error);
    toast.error("Erreur lors de l'activation des notifications push");
    return false;
  }
}

export async function togglePushNotifications(enabled: boolean) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from('profiles')
      .update({ push_notifications_enabled: enabled })
      .eq('id', user.id);

    if (error) throw error;

    toast.success(enabled ? "Notifications push activées" : "Notifications push désactivées");
  } catch (error) {
    console.error('Error toggling push notifications:', error);
    toast.error("Erreur lors de la modification des notifications push");
  }
}