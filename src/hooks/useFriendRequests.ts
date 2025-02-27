
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PendingRequest } from "@/types/profile";

export const useFriendRequests = () => {
  const { data: pendingRequests = [], refetch: refetchPendingRequests } = useQuery({
    queryKey: ["pending-requests"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.rpc('get_friend_requests', {
        user_id: user.id
      });

      if (error) {
        console.error("Error fetching friend requests:", error);
        return [];
      }

      return data as PendingRequest[];
    }
  });

  const handleAcceptRequest = async (requestId: string, senderId: string, senderName: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Vous devez être connecté pour accepter des demandes d'ami");
      return;
    }

    const { data, error } = await supabase.rpc('accept_friend_request', {
      p_request_id: requestId,
      p_user_id: user.id
    });

    if (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Erreur lors de l'acceptation de la demande");
      return;
    }

    if (data) {
      toast.success(`Vous êtes maintenant ami avec ${senderName}`);
      refetchPendingRequests();
    }
  };

  const handleRejectRequest = async (requestId: string, senderName: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Vous devez être connecté pour rejeter des demandes d'ami");
      return;
    }

    const { data, error } = await supabase.rpc('reject_friend_request', {
      p_request_id: requestId,
      p_user_id: user.id
    });

    if (error) {
      console.error("Error rejecting friend request:", error);
      toast.error("Erreur lors du rejet de la demande");
      return;
    }

    if (data) {
      toast.success(`Vous avez rejeté la demande de ${senderName}`);
      refetchPendingRequests();
    }
  };

  const handleCancelRequest = async (requestId: string, receiverName: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Vous devez être connecté pour annuler des demandes d'ami");
      return;
    }

    const { data, error } = await supabase.rpc('cancel_friend_request', {
      p_request_id: requestId,
      p_user_id: user.id
    });

    if (error) {
      console.error("Error canceling friend request:", error);
      toast.error("Erreur lors de l'annulation de la demande");
      return;
    }

    if (data) {
      toast.success(`Demande d'ami à ${receiverName} annulée`);
      refetchPendingRequests();
    }
  };

  return {
    pendingRequests,
    handleAcceptRequest,
    handleRejectRequest,
    handleCancelRequest
  };
};
