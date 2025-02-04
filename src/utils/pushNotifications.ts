import { supabase } from "@/integrations/supabase/client";

export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      registerServiceWorker();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
}

async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY
    });

    const { user } = await supabase.auth.getUser();
    if (user?.id) {
      await supabase
        .from("profiles")
        .update({
          push_token: JSON.stringify(subscription),
          push_notifications_enabled: true
        })
        .eq("id", user.id);
    }
  } catch (error) {
    console.error("Error registering service worker:", error);
  }
}

export async function sendPushNotification(userId: string, title: string, body: string) {
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("push_token")
      .eq("id", userId)
      .single();

    if (profile?.push_token) {
      await supabase.functions.invoke("push-notification", {
        body: {
          subscription: JSON.parse(profile.push_token),
          title,
          body
        }
      });
    }
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}