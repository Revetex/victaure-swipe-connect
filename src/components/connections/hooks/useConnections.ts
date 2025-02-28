
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Friend } from '@/types/profile';

export const useConnections = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const fetchConnections = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('user_connections_view')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq('status', 'accepted')
        .eq('connection_type', 'friend');

      if (error) throw error;

      return (data || []).map(conn => {
        const isUser = conn.sender_id === user.id;
        const friend: Friend = {
          id: isUser ? conn.receiver_id : conn.sender_id,
          full_name: isUser ? conn.receiver_name : conn.sender_name,
          avatar_url: isUser ? conn.receiver_avatar : conn.sender_avatar,
          online_status: false, // Will be updated with separate query
          friendship_id: conn.id,
          status: conn.status,
          friends: []
        };
        
        return friend;
      });
    } catch (error) {
      console.error('Error fetching connections:', error);
      return [];
    }
  };

  // Get online status for friends
  const updateOnlineStatus = async (friends: Friend[]) => {
    if (!friends.length) return friends;

    const friendIds = friends.map(friend => friend.id);
    
    const { data: onlineData } = await supabase
      .from('profiles')
      .select('id, online_status, last_seen')
      .in('id', friendIds);

    return friends.map(friend => {
      const onlineInfo = onlineData?.find(profile => profile.id === friend.id);
      return {
        ...friend,
        online_status: onlineInfo?.online_status || false,
        last_seen: onlineInfo?.last_seen || null
      };
    });
  };

  const { data: connections = [], isLoading, refetch } = useQuery({
    queryKey: ['connections', user?.id],
    queryFn: async () => {
      const friends = await fetchConnections();
      return updateOnlineStatus(friends);
    },
    enabled: !!user,
  });

  // Apply filters
  const filteredConnections = connections.filter(friend => {
    // Filter by search query
    const matchesSearch = searchQuery 
      ? (friend.full_name || '').toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    // Filter by online status
    const matchesOnlineStatus = showOnlineOnly ? friend.online_status : true;
    
    return matchesSearch && matchesOnlineStatus;
  });

  const fetchPendingRequests = async () => {
    if (!user) return { incoming: [], outgoing: [] };

    try {
      const { data, error } = await supabase
        .from('user_connections')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at,
          updated_at,
          sender:profiles!sender_id(id, full_name, avatar_url),
          receiver:profiles!receiver_id(id, full_name, avatar_url)
        `)
        .eq('status', 'pending')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (error) throw error;

      const incoming = data
        .filter(req => req.receiver_id === user.id)
        .map(req => ({
          ...req,
          type: 'incoming'
        }));

      const outgoing = data
        .filter(req => req.sender_id === user.id)
        .map(req => ({
          ...req,
          type: 'outgoing'
        }));

      return { incoming, outgoing };
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      return { incoming: [], outgoing: [] };
    }
  };

  return {
    connections: filteredConnections,
    isLoading,
    refetch,
    searchQuery,
    setSearchQuery,
    showOnlineOnly,
    setShowOnlineOnly,
    fetchPendingRequests,
  };
};
