
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { connectionAdapter } from "@/utils/connectionAdapters";
import { useConnectionStatus } from "./useConnectionStatus";

export function useConnectionActions(profileId: string) {
  const { 
    isConnected, 
    isPendingSent, 
    isPendingReceived, 
    refreshStatus,
    sendConnectionRequest,
    acceptConnectionRequest,
    removeConnection,
    toggleBlockUser
  } = useConnectionStatus(profileId);

  const handleConnect = () => {
    if (isConnected) {
      removeConnection();
    } else if (isPendingReceived) {
      acceptConnectionRequest();
    } else if (!isPendingSent) {
      sendConnectionRequest();
    }
  };

  const handleRequestCV = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("notifications").insert({
        user_id: profileId,
        title: "Demande de CV",
        message: `${user.email} aimerait consulter votre CV`,
      });

      toast.success("Demande de CV envoyée");
    } catch (error) {
      console.error('Error requesting CV:', error);
      toast.error("Erreur lors de l'envoi de la demande");
    }
  };

  return {
    isConnected,
    isPendingSent,
    isPendingReceived,
    toggleBlockUser,
    handleConnect,
    handleRequestCV,
    refreshStatus
  };
}
