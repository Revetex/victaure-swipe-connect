
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { friendRequestsAdapter } from "@/utils/connectionAdapters";

export function useConnectionStatus(profileId: string) {
  const [isFriend, setIsFriend] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);
  const [isFriendRequestReceived, setIsFriendRequestReceived] = useState(false);

  useEffect(() => {
    const checkFriendshipStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Vérifier si les utilisateurs sont déjà amis ou en attente
        const { data: pendingRequests } = await friendRequestsAdapter.findPendingRequests(user.id);
        const { data: acceptedRequests } = await friendRequestsAdapter.findAcceptedConnections(user.id);

        // Vérifier s'ils sont amis
        setIsFriend(acceptedRequests && acceptedRequests.some(req => 
          (req.sender_id === profileId || req.receiver_id === profileId)));

        // Vérifier s'il y a des demandes en attente
        if (pendingRequests && pendingRequests.length > 0) {
          // Vérifier si l'utilisateur a envoyé une demande
          const sentRequest = pendingRequests.find(req => 
            req.sender_id === user.id && req.receiver_id === profileId);
          
          // Vérifier si l'utilisateur a reçu une demande
          const receivedRequest = pendingRequests.find(req => 
            req.receiver_id === user.id && req.sender_id === profileId);
          
          setIsFriendRequestSent(!!sentRequest);
          setIsFriendRequestReceived(!!receivedRequest);
        }

        // Vérifier si bloqué
        const { data: blockStatus } = await supabase
          .from('blocked_users')
          .select('*')
          .eq('blocker_id', user.id)
          .eq('blocked_id', profileId);

        setIsBlocked(blockStatus && blockStatus.length > 0);
      } catch (error) {
        console.error('Error checking friendship status:', error);
      }
    };

    if (profileId) {
      checkFriendshipStatus();
    }
  }, [profileId]);

  return {
    isFriend,
    isBlocked,
    isFriendRequestSent,
    isFriendRequestReceived,
  };
}
