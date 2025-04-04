
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

      const { data: incomingRequests } = await supabase
        .from("friend_requests")
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at,
          sender:profiles!friend_requests_sender_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          receiver:profiles!friend_requests_receiver_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq("receiver_id", user.id)
        .eq("status", "pending");

      const { data: outgoingRequests } = await supabase
        .from("friend_requests")
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at,
          sender:profiles!friend_requests_sender_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          receiver:profiles!friend_requests_receiver_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq("sender_id", user.id)
        .eq("status", "pending");

      const formattedIncoming = (incomingRequests || []).map(request => ({
        ...request,
        type: 'incoming' as const,
        status: request.status as "pending" | "accepted" | "rejected"
      }));

      const formattedOutgoing = (outgoingRequests || []).map(request => ({
        ...request,
        type: 'outgoing' as const,
        status: request.status as "pending" | "accepted" | "rejected"
      }));

      return [...formattedIncoming, ...formattedOutgoing] as PendingRequest[];
    }
  });

  const handleAcceptRequest = async (requestId: string, senderId: string, senderName: string) => {
    const { error } = await supabase
      .from("friend_requests")
      .update({ status: "accepted" as const })
      .eq("id", requestId);

    if (error) {
      toast.error("Erreur lors de l'acceptation de la demande");
      return;
    }

    toast.success(`Vous êtes maintenant ami avec ${senderName}`);
    refetchPendingRequests();
  };

  const handleRejectRequest = async (requestId: string, senderName: string) => {
    const { error } = await supabase
      .from("friend_requests")
      .delete()
      .eq("id", requestId);

    if (error) {
      toast.error("Erreur lors du rejet de la demande");
      return;
    }

    toast.success(`Vous avez rejeté la demande de ${senderName}`);
    refetchPendingRequests();
  };

  const handleCancelRequest = async (requestId: string, receiverName: string) => {
    const { error } = await supabase
      .from("friend_requests")
      .delete()
      .eq("id", requestId);

    if (error) {
      toast.error("Erreur lors de l'annulation de la demande");
      return;
    }

    toast.success(`Demande d'ami à ${receiverName} annulée`);
    refetchPendingRequests();
  };

  return {
    pendingRequests,
    handleAcceptRequest,
    handleRejectRequest,
    handleCancelRequest
  };
};
