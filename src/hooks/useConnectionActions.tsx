
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { friendRequestsAdapter } from "@/utils/connectionAdapters";
import { useState, useEffect } from "react";

export function useConnectionActions(profileId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [isPendingSent, setIsPendingSent] = useState(false);
  const [isPendingReceived, setIsPendingReceived] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshStatus = async () => {
    if (!profileId) return;
    
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Vérifier si les utilisateurs sont déjà amis
      const { data: acceptedConnections } = await friendRequestsAdapter.findAcceptedConnections(user.id);
      if (acceptedConnections) {
        const isFriend = acceptedConnections.some(conn => 
          conn.sender_id === profileId || conn.receiver_id === profileId);
        setIsConnected(isFriend);
      }

      // Vérifier s'il y a des demandes en attente
      const { data: pendingRequests } = await friendRequestsAdapter.findPendingRequests(user.id);
      if (pendingRequests) {
        const sentRequest = pendingRequests.find(req => 
          req.sender_id === user.id && req.receiver_id === profileId);
        
        const receivedRequest = pendingRequests.find(req => 
          req.receiver_id === user.id && req.sender_id === profileId);
        
        setIsPendingSent(!!sentRequest);
        setIsPendingReceived(!!receivedRequest);
      }

      // Vérifier si bloqué
      const { data: blockStatus } = await supabase
        .from('blocked_users')
        .select('*')
        .eq('blocker_id', user.id)
        .eq('blocked_id', profileId)
        .maybeSingle();

      setIsBlocked(!!blockStatus);
    } catch (error) {
      console.error("Error checking connection status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (isConnected) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Trouver la connexion à supprimer
        const { data: connections } = await supabase
          .from('user_connections')
          .select('id')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${user.id})`);

        if (connections && connections.length > 0) {
          for (const conn of connections) {
            await friendRequestsAdapter.deleteFriendRequest(conn.id);
          }
          toast.success("Connexion supprimée");
          refreshStatus();
        }
      } catch (error) {
        console.error("Error removing connection:", error);
        toast.error("Erreur lors de la suppression de la connexion");
      }
    } else if (isPendingReceived) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Trouver la demande à accepter
        const { data: pendingRequests } = await friendRequestsAdapter.findPendingRequests(user.id);
        if (pendingRequests) {
          const request = pendingRequests.find(req => 
            req.sender_id === profileId && req.receiver_id === user.id);
          
          if (request) {
            await friendRequestsAdapter.acceptFriendRequest(request.id);
            toast.success("Demande acceptée");
            refreshStatus();
          }
        }
      } catch (error) {
        console.error("Error accepting request:", error);
        toast.error("Erreur lors de l'acceptation de la demande");
      }
    } else if (!isPendingSent) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await friendRequestsAdapter.createFriendRequest(user.id, profileId);
        toast.success("Demande envoyée");
        refreshStatus();
      } catch (error) {
        console.error("Error sending request:", error);
        toast.error("Erreur lors de l'envoi de la demande");
      }
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

  const toggleBlockUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (isBlocked) {
        await supabase
          .from('blocked_users')
          .delete()
          .eq('blocker_id', user.id)
          .eq('blocked_id', profileId);
        toast.success("Utilisateur débloqué");
      } else {
        await supabase
          .from('blocked_users')
          .insert({
            blocker_id: user.id,
            blocked_id: profileId
          });
        toast.success("Utilisateur bloqué");
      }
      refreshStatus();
    } catch (error) {
      console.error("Error toggling block status:", error);
      toast.error("Erreur lors du blocage/déblocage");
    }
  };

  useEffect(() => {
    refreshStatus();
  }, [profileId]);

  return {
    isConnected,
    isPendingSent,
    isPendingReceived,
    isBlocked,
    loading,
    handleConnect,
    handleRequestCV,
    toggleBlockUser,
    refreshStatus
  };
}
