
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { connectionAdapter } from "@/utils/connectionAdapters";
import { toast } from "sonner";

export function useConnectionStatus(profileId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isPendingSent, setIsPendingSent] = useState(false);
  const [isPendingReceived, setIsPendingReceived] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshStatus = async () => {
    if (!profileId) return;
    
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Vérifier le statut de la connexion
      const connectionStatus = await connectionAdapter.checkConnectionStatus(user.id, profileId);
      
      setIsConnected(connectionStatus.isConnected);
      setIsPendingSent(connectionStatus.isPending && connectionStatus.isSender);
      setIsPendingReceived(connectionStatus.isPending && !connectionStatus.isSender);

      // Vérifier si l'utilisateur est bloqué
      const { data: blockData } = await supabase
        .from('blocked_users')
        .select('*')
        .eq('blocker_id', user.id)
        .eq('blocked_id', profileId)
        .maybeSingle();

      setIsBlocked(!!blockData);
    } catch (error) {
      console.error("Error checking connection status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const sendConnectionRequest = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await connectionAdapter.createConnectionRequest(user.id, profileId);
      
      if (error) throw error;
      
      toast.success("Demande de connexion envoyée");
      refreshStatus();
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast.error("Erreur lors de l'envoi de la demande");
    }
  };

  const acceptConnectionRequest = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Trouver la demande en attente
      const { data: pendingRequests } = await connectionAdapter.findPendingRequests(user.id);
      
      if (!pendingRequests || pendingRequests.length === 0) {
        throw new Error("Demande introuvable");
      }
      
      const request = pendingRequests.find(req => 
        req.sender_id === profileId && req.receiver_id === user.id);
      
      if (!request) {
        throw new Error("Demande introuvable");
      }

      const { error } = await connectionAdapter.acceptConnectionRequest(request.id);
      
      if (error) throw error;
      
      toast.success("Demande de connexion acceptée");
      refreshStatus();
    } catch (error) {
      console.error("Error accepting connection request:", error);
      toast.error("Erreur lors de l'acceptation de la demande");
    }
  };

  const removeConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Trouver toutes les connexions entre ces utilisateurs
      const { data: connections } = await supabase
        .from('user_connections')
        .select('id')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${user.id})`);

      if (!connections || connections.length === 0) {
        throw new Error("Connexion introuvable");
      }
      
      // Supprimer toutes les connexions trouvées
      for (const connection of connections) {
        const { error } = await connectionAdapter.deleteConnectionRequest(connection.id);
        if (error) throw error;
      }
      
      toast.success("Connexion supprimée");
      refreshStatus();
    } catch (error) {
      console.error("Error removing connection:", error);
      toast.error("Erreur lors de la suppression de la connexion");
    }
  };

  const toggleBlockUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (isBlocked) {
        // Débloquer
        const { error } = await supabase
          .from('blocked_users')
          .delete()
          .eq('blocker_id', user.id)
          .eq('blocked_id', profileId);

        if (error) throw error;
        
        toast.success("Utilisateur débloqué");
      } else {
        // Bloquer
        const { error } = await supabase
          .from('blocked_users')
          .insert({
            blocker_id: user.id,
            blocked_id: profileId
          });

        if (error) throw error;
        
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
    isBlocked,
    isPendingSent,
    isPendingReceived,
    loading,
    sendConnectionRequest,
    acceptConnectionRequest,
    removeConnection,
    toggleBlockUser,
    refreshStatus
  };
}
