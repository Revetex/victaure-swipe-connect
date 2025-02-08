
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { EmptyConnectionsState } from "./EmptyConnectionsState";
import { FriendList } from "./FriendList";
import { ConnectionsPagination } from "./ConnectionsPagination";
import { PendingRequestsSection } from "./PendingRequestsSection";
import { UserProfile } from "@/types/profile";

export function ConnectionsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showPendingRequests, setShowPendingRequests] = useState(false);
  const itemsPerPage = 5;

  const { data: friends } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: acceptedRequests } = await supabase
        .from("friend_requests")
        .select(`
          sender:profiles!friend_requests_sender_id_fkey(
            id, 
            full_name, 
            avatar_url, 
            online_status, 
            last_seen,
            email,
            role,
            bio,
            phone,
            city,
            state,
            country,
            skills,
            latitude,
            longitude
          ),
          receiver:profiles!friend_requests_receiver_id_fkey(
            id, 
            full_name, 
            avatar_url, 
            online_status, 
            last_seen,
            email,
            role,
            bio,
            phone,
            city,
            state,
            country,
            skills,
            latitude,
            longitude
          )
        `)
        .eq("status", "accepted")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (!acceptedRequests) return [];

      return acceptedRequests.map(request => {
        const friend = request.sender.id === user.id ? request.receiver : request.sender;
        return {
          ...friend,
          country: friend.country || "Canada", // Provide default values for required fields
          role: friend.role || "professional",
          email: friend.email || "",
          skills: friend.skills || [],
          online_status: friend.online_status || false,
          last_seen: friend.last_seen || new Date().toISOString()
        } as UserProfile;
      });
    }
  });

  if (!friends?.length) {
    return <EmptyConnectionsState />;
  }

  const totalPages = Math.ceil(friends.length / itemsPerPage);

  return (
    <div className="space-y-3">
      <PendingRequestsSection 
        showPendingRequests={showPendingRequests}
        onToggle={() => setShowPendingRequests(!showPendingRequests)}
      />

      <motion.div 
        className="bg-muted/20 rounded-xl shadow-sm backdrop-blur-sm p-4 border border-border/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium flex items-center gap-2 bg-gradient-to-br from-foreground/90 via-foreground/80 to-foreground/70 bg-clip-text text-transparent">
            <Users2 className="h-4 w-4" />
            Mes connections ({friends.length})
          </h3>
        </div>
        
        <FriendList 
          friends={friends}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />

        <ConnectionsPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </motion.div>
    </div>
  );
}
