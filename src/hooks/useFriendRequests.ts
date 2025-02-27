
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PendingRequest } from "@/types/profile";

export const useFriendRequests = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { data: pendingRequests = [], refetch: refetchPendingRequests, isLoading: isQueryLoading } = useQuery({
    queryKey: ["pending-requests"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: connections, error } = await supabase
        .from('user_connections')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at,
          updated_at,
          sender:profiles!sender_id(
            id,
            full_name,
            avatar_url
          ),
          receiver:profiles!receiver_id(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('status', 'pending')
        .eq('connection_type', 'friend')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (error) {
        console.error("Error fetching friend requests:", error);
        return [];
      }

      // Map the data to match our PendingRequest type
      return (connections || []).map(conn => ({
        id: conn.id,
        sender_id: conn.sender_id,
        receiver_id: conn.receiver_id,
        status: conn.status,
        created_at: conn.created_at,
        updated_at: conn.updated_at,
        sender: {
          id: conn.sender.id,
          full_name: conn.sender.full_name,
          avatar_url: conn.sender.avatar_url
        },
        receiver: {
          id: conn.receiver.id,
          full_name: conn.receiver.full_name,
          avatar_url: conn.receiver.avatar_url
        },
        type: conn.receiver_id === user.id ? 'incoming' : 'outgoing'
      })) as PendingRequest[];
    }
  });

  const handleAcceptRequest = async (requestId: string, senderId: string, senderName: string) => {
    try {
      setIsLoading(true);
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
    } catch (error) {
      console.error("Error in handleAcceptRequest:", error);
      toast.error("Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectRequest = async (requestId: string, senderName: string) => {
    try {
      setIsLoading(true);
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
    } catch (error) {
      console.error("Error in handleRejectRequest:", error);
      toast.error("Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async (requestId: string, receiverName: string) => {
    try {
      setIsLoading(true);
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
    } catch (error) {
      console.error("Error in handleCancelRequest:", error);
      toast.error("Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pendingRequests,
    isLoading: isLoading || isQueryLoading,
    handleAcceptRequest,
    handleRejectRequest,
    handleCancelRequest,
    refetchPendingRequests
  };
};
