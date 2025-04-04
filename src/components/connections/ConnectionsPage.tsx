
import { motion } from "framer-motion";
import { ConnectionsList } from "./ConnectionsList";
import { ConnectionsHeader } from "./ConnectionsHeader";
import { ConnectionsSearch } from "./ConnectionsSearch";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { UserProfile } from "@/types/profile";

export function ConnectionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPendingRequests, setShowPendingRequests] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background relative z-0">
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <Card className="bg-card/50 backdrop-blur-sm p-6 relative border rounded-xl shadow-lg">
            <ConnectionsHeader 
              showPendingRequests={showPendingRequests}
              onTogglePendingRequests={() => setShowPendingRequests(!showPendingRequests)}
            />
            
            <ConnectionsSearch 
              value={searchQuery}
              onChange={setSearchQuery}
              onSelectProfile={setSelectedProfile}
            />
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-6 relative z-0"
          >
            <ConnectionsList
              searchQuery={searchQuery}
              showPendingRequests={showPendingRequests}
              selectedProfile={selectedProfile}
              onClose={() => setSelectedProfile(null)}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
