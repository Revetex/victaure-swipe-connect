
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users2, UserPlus2, UserCheck, MessageCircle } from "lucide-react";
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
      <Card className="p-8 bg-black/40">
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
      <Card className="bg-black/40 border-zinc-800 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
          <div className="flex items-center gap-3">
            <UserPlus2 className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-white">Mes Connexions</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPendingRequests(!showPendingRequests)}
            className="hidden sm:flex bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Demandes en attente
          </Button>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <Input
              placeholder="Rechercher une connexion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-400"
            />
            <Users2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-4 bg-zinc-900/50">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-zinc-800"
              >
                Toutes ({filteredFriends.length})
              </TabsTrigger>
              <TabsTrigger 
                value="online"
                className="data-[state=active]:bg-zinc-800"
              >
                En ligne ({filteredFriends.filter(f => f.online_status).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <ScrollArea className="h-[500px] rounded-lg bg-zinc-900/30 p-4">
                {filteredFriends.length > 0 ? (
                  <div className="space-y-2">
                    {filteredFriends.slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    ).map(friend => (
                      <div key={friend.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={friend.avatar_url || "/user-icon.svg"}
                              alt={friend.full_name || "User"}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            {friend.online_status && (
                              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-zinc-900" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{friend.full_name}</p>
                            <p className="text-xs text-zinc-400">{friend.role}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                        >
                          <MessageCircle className="h-5 w-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyConnectionsState />
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="online" className="mt-0">
              <ScrollArea className="h-[500px] rounded-lg bg-zinc-900/30 p-4">
                {filteredFriends.filter(f => f.online_status).length > 0 ? (
                  <div className="space-y-2">
                    {filteredFriends
                      .filter(f => f.online_status)
                      .map(friend => (
                        <div key={friend.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={friend.avatar_url || "/user-icon.svg"}
                                alt={friend.full_name || "User"}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-zinc-900" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{friend.full_name}</p>
                              <p className="text-xs text-zinc-400">{friend.role}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                          >
                            <MessageCircle className="h-5 w-5" />
                          </Button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-zinc-400">
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
        </div>
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
