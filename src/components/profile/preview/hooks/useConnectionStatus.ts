
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useConnectionStatus(profileId: string) {
  const [isFriend, setIsFriend] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);
  const [isFriendRequestReceived, setIsFriendRequestReceived] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFriendshipStatus = async () => {
      if (!profileId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Check if they are already friends
        const { data: areFriendsData, error: areFriendsError } = await supabase
          .rpc('are_friends', { 
            user1_id: user.id, 
            user2_id: profileId 
          });

        if (areFriendsError) {
          console.error("Error checking friendship status:", areFriendsError);
          return;
        }

        setIsFriend(areFriendsData);

        // Check pending requests
        const { data: connections, error: connectionsError } = await supabase
          .from('user_connections')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .or(`sender_id.eq.${profileId},receiver_id.eq.${profileId}`)
          .eq('status', 'pending');

        if (connectionsError) {
          console.error("Error checking pending requests:", connectionsError);
          return;
        }

        if (connections) {
          const sentRequest = connections.find(
            conn => conn.sender_id === user.id && conn.receiver_id === profileId
          );
          const receivedRequest = connections.find(
            conn => conn.sender_id === profileId && conn.receiver_id === user.id
          );
          
          setIsFriendRequestSent(!!sentRequest);
          setIsFriendRequestReceived(!!receivedRequest);
        }

        // Check if blocked
        const { data: blockStatus, error: blockError } = await supabase
          .from('blocked_users')
          .select('*')
          .eq('blocker_id', user.id)
          .eq('blocked_id', profileId);

        if (blockError) {
          console.error("Error checking block status:", blockError);
          return;
        }

        setIsBlocked(blockStatus && blockStatus.length > 0);
      } catch (error) {
        console.error('Error checking connection status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFriendshipStatus();

    // Setup realtime subscription for connection changes
    const channel = supabase
      .channel('connections-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_connections'
      }, () => {
        checkFriendshipStatus();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId]);

  return {
    isFriend,
    isBlocked,
    isFriendRequestSent,
    isFriendRequestReceived,
    isLoading
  };
}
