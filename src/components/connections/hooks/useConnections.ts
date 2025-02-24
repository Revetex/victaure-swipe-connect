
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";
import { toast } from "sonner";

export function useConnections() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: connections, isLoading, error } = useQuery({
    queryKey: ["connections"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get all accepted friend requests where user is either sender or receiver
      const { data: friendRequests, error: friendRequestsError } = await supabase
        .from("friend_requests")
        .select(`
          sender:profiles!friend_requests_sender_id_fkey(*),
          receiver:profiles!friend_requests_receiver_id_fkey(*)
        `)
        .eq("status", "accepted")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (friendRequestsError) {
        toast.error("Erreur lors du chargement des connexions");
        throw friendRequestsError;
      }

      // Transform the data to get a flat list of connections
      const connections = friendRequests?.map(request => {
        const connection = request.sender.id === user.id ? request.receiver : request.sender;
        return connection as UserProfile;
      });

      return connections || [];
    }
  });

  const totalPages = Math.ceil((connections?.length || 0) / itemsPerPage);

  return {
    connections,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage
  };
}
