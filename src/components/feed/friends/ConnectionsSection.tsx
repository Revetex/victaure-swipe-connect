
import { motion } from "framer-motion";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectionsHeader } from "./components/ConnectionsHeader";
import { ConnectionsSearch } from "./components/ConnectionsSearch";
import { FriendsTabContent } from "./components/FriendsTabContent";
import { PendingRequestsSection } from "./PendingRequestsSection";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useFriendRequests } from "@/hooks/useFriendRequests";

export function ConnectionsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showPendingRequests, setShowPendingRequests] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const itemsPerPage = 5;
  const { pendingRequests, refetchPendingRequests } = useFriendRequests();

  const hasPendingRequests = pendingRequests.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className="bg-black/40 border-zinc-800 shadow-2xl backdrop-blur-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-800/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Mes connexions</h2>
            {hasPendingRequests && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center"
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white/90 text-xs px-2 py-0 h-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-500/30"
                  onClick={() => setShowPendingRequests(!showPendingRequests)}
                >
                  {pendingRequests.length} demandes en attente
                </Button>
              </motion.div>
            )}
          </div>
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-white/70 hover:text-white"
            onClick={() => refetchPendingRequests()}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <ConnectionsSearch 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
          />

          <Tabs 
            defaultValue="all" 
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="w-full grid grid-cols-2 mb-4 bg-zinc-900/50">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-zinc-800"
              >
                Toutes
              </TabsTrigger>
              <TabsTrigger 
                value="online" 
                className="data-[state=active]:bg-zinc-800"
              >
                En ligne
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <FriendsTabContent 
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                searchQuery={searchQuery}
              />
            </TabsContent>

            <TabsContent value="online" className="mt-0">
              <FriendsTabContent 
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                showOnlineOnly
                searchQuery={searchQuery}
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
