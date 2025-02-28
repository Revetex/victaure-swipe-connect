
import { useState } from "react";
import { ConnectionsPagination } from "./ConnectionsPagination";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { cn } from "@/lib/utils";
import { PendingRequestsSection } from "./PendingRequestsSection";
import { FriendList } from "./FriendList";
import { FriendListHeader } from "./FriendListHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Friend } from "@/types/profile";

interface ConnectionsSectionProps {
  searchQuery: string;
  onTogglePending: () => void;
  showPendingRequests: boolean;
}

export function ConnectionsSection({ searchQuery, onTogglePending, showPendingRequests }: ConnectionsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const { pendingRequests, refetchPendingRequests } = useFriendRequests();
  const { user } = useAuth();

  // Fetch connections from user_connections_view
  const { data: connections = [], isLoading } = useQuery({
    queryKey: ['connections', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_connections_view')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq('status', 'accepted')
        .eq('connection_type', 'friend');

      if (error) {
        console.error("Error fetching connections:", error);
        return [];
      }

      // Map the connections to Friend objects
      const friends: Friend[] = data.map(conn => {
        const isUserSender = conn.sender_id === user.id;
        
        return {
          id: isUserSender ? conn.receiver_id : conn.sender_id,
          full_name: isUserSender ? conn.receiver_name : conn.sender_name,
          avatar_url: isUserSender ? conn.receiver_avatar : conn.sender_avatar,
          online_status: false, // Default value, will be updated
          last_seen: null,
          friendship_id: conn.id,
          status: conn.status,
          friends: []
        };
      });

      // Get online status for these friends
      if (friends.length > 0) {
        const friendIds = friends.map(f => f.id);
        
        const { data: onlineData } = await supabase
          .from('profiles')
          .select('id, online_status, last_seen')
          .in('id', friendIds);
          
        if (onlineData) {
          // Update the online status of each friend
          friends.forEach(friend => {
            const profile = onlineData.find(p => p.id === friend.id);
            if (profile) {
              friend.online_status = profile.online_status;
              friend.last_seen = profile.last_seen;
            }
          });
        }
      }

      return friends;
    },
    enabled: !!user
  });

  // Apply filters
  const filteredConnections = connections.filter(friend => {
    // Search filter
    const matchesSearch = searchQuery 
      ? (friend.full_name || '').toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    // Online filter
    const matchesOnline = showOnlineOnly ? friend.online_status : true;
    
    return matchesSearch && matchesOnline;
  });
  
  // Calculate total pages
  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(filteredConnections.length / itemsPerPage));
  
  // Get current page's connections
  const currentConnections = filteredConnections.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div
      className={cn(
        "flex flex-col w-full grow space-y-4",
        "p-0 lg:p-0"
      )}
    >
      <PendingRequestsSection showPendingRequests={showPendingRequests} onToggle={onTogglePending} />

      <div className="flex flex-col grow space-y-3">
        <FriendListHeader 
          showOnlineOnly={showOnlineOnly} 
          setShowOnlineOnly={setShowOnlineOnly} 
          pendingCount={pendingRequests.length} 
          onTogglePending={onTogglePending}
        />
        <FriendList 
          connections={currentConnections}
          showOnlineOnly={showOnlineOnly} 
          searchQuery={searchQuery} 
          currentPage={currentPage}
          itemsPerPage={8}
        />
        <ConnectionsPagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
