
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PendingRequest } from "@/types/profile";
import { friendRequestsAdapter } from "@/utils/connectionAdapters";

export const useFriendRequests = () => {
  const { data: pendingRequests = [], refetch: refetchPendingRequests } = useQuery({
    queryKey: ["pending-requests"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: connections } = await friendRequestsAdapter.findPendingRequests(user.id);
      
      if (!connections) return [];

      const formattedRequests = connections.map(request => {
        const isIncoming = request.receiver_id === user.id;
        
        return {
          id: request.id,
          sender_id: request.sender_id,
          receiver_id: request.receiver_id,
          status: request.status,
          created_at: request.created_at,
          updated_at: request.updated_at || request.created_at,
          type: isIncoming ? 'incoming' : 'outgoing',
          sender: {
            id: request.sender.id,
            full_name: request.sender.full_name,
            avatar_url: request.sender.avatar_url,
            // Ajout des propriétés nécessaires pour satisfaire le type UserProfile
            email: "",
            certifications: [],
            education: [],
            experiences: [],
            friends: []
          },
          receiver: {
            id: request.receiver.id,
            full_name: request.receiver.full_name,
            avatar_url: request.receiver.avatar_url,
            // Ajout des propriétés nécessaires pour satisfaire le type UserProfile
            email: "",
            certifications: [],
            education: [],
            experiences: [],
            friends: []
          }
        } as PendingRequest;
      });

      return formattedRequests;
    }
  });

  const handleAcceptRequest = async (requestId: string, senderId: string, senderName: string) => {
    try {
      const { error } = await friendRequestsAdapter.acceptFriendRequest(requestId);

      if (error) {
        toast.error("Erreur lors de l'acceptation de la demande");
        return;
      }

      toast.success(`Vous êtes maintenant ami avec ${senderName}`);
      refetchPendingRequests();
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la demande:", error);
      toast.error("Une erreur est survenue");
    }
  };

  const handleRejectRequest = async (requestId: string, senderName: string) => {
    try {
      const { error } = await friendRequestsAdapter.deleteFriendRequest(requestId);

      if (error) {
        toast.error("Erreur lors du rejet de la demande");
        return;
      }

      toast.success(`Vous avez rejeté la demande de ${senderName}`);
      refetchPendingRequests();
    } catch (error) {
      console.error("Erreur lors du rejet de la demande:", error);
      toast.error("Une erreur est survenue");
    }
  };

  const handleCancelRequest = async (requestId: string, receiverName: string) => {
    try {
      const { error } = await friendRequestsAdapter.deleteFriendRequest(requestId);

      if (error) {
        toast.error("Erreur lors de l'annulation de la demande");
        return;
      }

      toast.success(`Demande d'ami à ${receiverName} annulée`);
      refetchPendingRequests();
    } catch (error) {
      console.error("Erreur lors de l'annulation de la demande:", error);
      toast.error("Une erreur est survenue");
    }
  };

  return {
    pendingRequests,
    handleAcceptRequest,
    handleRejectRequest,
    handleCancelRequest
  };
};
