
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
import { useAuth } from "@/hooks/useAuth";

export function ConnectionsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showPendingRequests, setShowPendingRequests] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;
  const { user } = useAuth();

  const { isLoading } = useQuery({
    queryKey: ["friends", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from('friendships')
        .select('*')
        .eq('user_id', user.id);
      return data || [];
    }
  });

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

        <div className="p-4">
          <ConnectionsSearch 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
          />

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-4 bg-zinc-900/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-zinc-800">
                Toutes
              </TabsTrigger>
              <TabsTrigger value="online" className="data-[state=active]:bg-zinc-800">
                En ligne
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <FriendsTabContent 
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />
            </TabsContent>

            <TabsContent value="online" className="mt-0">
              <FriendsTabContent 
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                showOnlineOnly
              />
            </TabsContent>
          </Tabs>
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
