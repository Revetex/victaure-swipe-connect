
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectionsHeader } from "./components/ConnectionsHeader";
import { ConnectionsSearch } from "./components/ConnectionsSearch";
import { FriendsTabContent } from "./components/FriendsTabContent";
import { ConnectionsPagination } from "./ConnectionsPagination";
import { PendingRequestsSection } from "./PendingRequestsSection";
import { friendRequestsAdapter } from "@/utils/connectionAdapters";
import { UserProfile } from "@/types/profile";

export function ConnectionsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showPendingRequests, setShowPendingRequests] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;
  
  const {
    data: friends = [],
    isLoading
  } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data: acceptedConnections, error } = await friendRequestsAdapter.findAcceptedConnections(user.id);
      
      if (error) {
        console.error("Error fetching connections:", error);
        return [];
      }
      
      if (!acceptedConnections) return [];
      
      return acceptedConnections.map(connection => {
        // Déterminer quel profil représente l'ami (pas l'utilisateur courant)
        const friendProfile = connection.sender_id === user.id 
          ? connection.receiver 
          : connection.sender;
        
        if (!friendProfile) {
          console.error("Friend profile not found for connection:", connection);
          return {
            id: "",
            full_name: "Utilisateur inconnu",
            avatar_url: "",
            online_status: false,
            last_seen: new Date().toISOString(),
            email: "",
            country: "Canada",
            role: "professional",
            skills: [],
            certifications: [],
            education: [],
            experiences: [],
            friends: []
          } as UserProfile;
        }
        
        return {
          id: friendProfile.id || "",
          full_name: friendProfile.full_name || "Utilisateur inconnu",
          avatar_url: friendProfile.avatar_url || "",
          online_status: friendProfile.online_status || false,
          last_seen: friendProfile.last_seen || new Date().toISOString(),
          // Propriétés par défaut pour compléter l'objet UserProfile
          email: "",
          country: "Canada",
          role: "professional",
          skills: [],
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
      className="space-y-4 w-full px-4 sm:px-0"
    >
      <Card className="bg-black/40 border-zinc-800 shadow-2xl backdrop-blur-sm w-full">
        <ConnectionsHeader 
          showPendingRequests={showPendingRequests} 
          onTogglePendingRequests={() => setShowPendingRequests(!showPendingRequests)} 
        />

        <div className="p-6 px-[8px] py-[8px]">
          <ConnectionsSearch 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
          />

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-4 bg-zinc-900/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-zinc-800">
                Toutes ({filteredFriends.length})
              </TabsTrigger>
              <TabsTrigger value="online" className="data-[state=active]:bg-zinc-800">
                En ligne ({filteredFriends.filter(f => f.online_status).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <FriendsTabContent 
                friends={filteredFriends} 
                currentPage={currentPage} 
                itemsPerPage={itemsPerPage} 
              />
            </TabsContent>

            <TabsContent value="online" className="mt-0">
              <FriendsTabContent 
                friends={filteredFriends.filter(f => f.online_status)} 
                currentPage={currentPage} 
                itemsPerPage={itemsPerPage} 
                showOnlineOnly 
              />
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
