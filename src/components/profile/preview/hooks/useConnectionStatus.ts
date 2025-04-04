import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

        // Check if they are already friends
        const { data: friendRequests } = await supabase
          .from('friend_requests')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .or(`sender_id.eq.${profileId},receiver_id.eq.${profileId}`)
          .eq('status', 'accepted');

        setIsFriend(friendRequests && friendRequests.length > 0);

        // Check pending requests
        const { data: pendingRequests } = await supabase
          .from('friend_requests')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .or(`sender_id.eq.${profileId},receiver_id.eq.${profileId}`)
          .eq('status', 'pending');

        if (pendingRequests) {
          const sentRequest = pendingRequests.find(req => req.sender_id === user.id);
          const receivedRequest = pendingRequests.find(req => req.receiver_id === user.id);
          setIsFriendRequestSent(!!sentRequest);
          setIsFriendRequestReceived(!!receivedRequest);
        }

        // Check if blocked
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