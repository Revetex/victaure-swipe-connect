
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCircle, Users2, ChevronDown, ChevronUp } from "lucide-react";
import { ProfileNameButton } from "@/components/profile/ProfileNameButton";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FriendRequestsSection } from "./FriendRequestsSection";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";

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
          sender:profiles!friend_requests_sender_id_fkey(id, full_name, avatar_url, online_status, last_seen),
          receiver:profiles!friend_requests_receiver_id_fkey(id, full_name, avatar_url, online_status, last_seen)
        `)
        .eq("status", "accepted")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (!acceptedRequests) return [];

      return acceptedRequests.map(request => {
        const friend = request.sender.id === user.id ? request.receiver : request.sender;
        return friend;
      });
    }
  });

  if (!friends?.length) {
    return (
      <motion.div 
        className="text-center py-8 space-y-4 bg-card rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Users2 className="h-12 w-12 mx-auto text-muted-foreground/50" />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Aucune connection pour le moment</p>
          <p className="text-xs text-muted-foreground/70">
            Commencez à ajouter des contacts pour développer votre réseau
          </p>
        </div>
      </motion.div>
    );
  }

  const totalPages = Math.ceil(friends.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFriends = friends.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg shadow-sm">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between p-4 hover:bg-accent/5"
          onClick={() => setShowPendingRequests(!showPendingRequests)}
        >
          <span className="text-sm font-medium">Demandes en attente</span>
          {showPendingRequests ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        <AnimatePresence>
          {showPendingRequests && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0">
                <FriendRequestsSection />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-card rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Users2 className="h-4 w-4" />
            Mes connections ({friends.length})
          </h3>
        </div>
        
        <ScrollArea className="h-[300px] pr-2 mt-4">
          <AnimatePresence mode="wait">
            <div className="space-y-2">
              {currentFriends.map((friend, index) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full flex items-center gap-3 h-auto p-3",
                      "hover:bg-accent/5 transition-all duration-200",
                      "group relative"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden relative">
                      {friend.avatar_url ? (
                        <img
                          src={friend.avatar_url}
                          alt={friend.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserCircle className="w-5 h-5 text-muted-foreground" />
                      )}
                      {friend.online_status && (
                        <motion.div 
                          className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <ProfileNameButton 
                        profile={friend}
                        className="p-0 h-auto text-sm font-medium hover:underline"
                      />
                      <p className="text-xs text-muted-foreground">
                        {friend.online_status ? 'En ligne' : 'Hors ligne'}
                      </p>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </ScrollArea>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className="transition-colors duration-200"
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
