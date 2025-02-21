
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users2, UserPlus2, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { EmptyConnectionsState } from "./EmptyConnectionsState";
import { FriendList } from "./FriendList";
import { ConnectionsPagination } from "./ConnectionsPagination";
import { PendingRequestsSection } from "./PendingRequestsSection";
import { UserProfile } from "@/types/profile";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ConnectionsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showPendingRequests, setShowPendingRequests] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: acceptedRequests } = await supabase
        .from("friend_requests")
        .select(`
          sender:profiles!friend_requests_sender_id_fkey(*),
          receiver:profiles!friend_requests_receiver_id_fkey(*)
        `)
        .eq("status", "accepted")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (!acceptedRequests) return [];

      return acceptedRequests.map(request => {
        const friend = request.sender.id === user.id ? request.receiver : request.sender;
        return {
          ...friend,
          country: friend.country || "Canada",
          role: friend.role || "professional",
          email: friend.email || "",
          skills: friend.skills || [],
          online_status: friend.online_status || false,
          last_seen: friend.last_seen || new Date().toISOString(),
          certifications: [],
          education: [],
          experiences: [],
          friends: []
        } as UserProfile;
      });
    }
  });

  const filteredFriends = friends.filter(friend => 
    friend.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Card>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-3xl mx-auto px-4 sm:px-6 py-8"
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <UserPlus2 className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Mes Connexions</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPendingRequests(!showPendingRequests)}
            className="hidden sm:flex"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Demandes en attente
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Input
              placeholder="Rechercher une connexion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Users2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="all">Toutes ({filteredFriends.length})</TabsTrigger>
            <TabsTrigger value="online">En ligne ({filteredFriends.filter(f => f.online_status).length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-[500px]">
              {filteredFriends.length > 0 ? (
                <FriendList 
                  friends={filteredFriends}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                />
              ) : (
                <EmptyConnectionsState />
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="online" className="mt-0">
            <ScrollArea className="h-[500px]">
              {filteredFriends.filter(f => f.online_status).length > 0 ? (
                <FriendList 
                  friends={filteredFriends.filter(f => f.online_status)}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune connexion en ligne
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {filteredFriends.length > itemsPerPage && (
          <div className="mt-6">
            <ConnectionsPagination 
              currentPage={currentPage}
              totalPages={Math.ceil(filteredFriends.length / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>

      {showPendingRequests && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <PendingRequestsSection 
            showPendingRequests={showPendingRequests}
            onToggle={() => setShowPendingRequests(!showPendingRequests)}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
