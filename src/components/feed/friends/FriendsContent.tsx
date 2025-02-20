
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { ConnectionsSection } from "./ConnectionsSection";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfilePreview } from "@/components/ProfilePreview";

export function FriendsContent() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const handleProfileSelect = async (profile: UserProfile) => {
    setSelectedProfile(profile);
  };

  const handleClosePreview = () => {
    setSelectedProfile(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <div className={cn(
            "bg-card/50 backdrop-blur-sm",
            "border rounded-xl shadow-lg",
            "p-4 lg:p-6"
          )}>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent mb-4">
              Trouver des connections
            </h2>
            <div className="relative">
              <ProfileSearch 
                onSelect={handleProfileSelect}
                placeholder="Rechercher par nom..."
                className="w-full"
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <ConnectionsSection />
          </motion.div>
        </motion.div>

        {selectedProfile && (
          <ProfilePreview
            profile={selectedProfile}
            isOpen={!!selectedProfile}
            onClose={handleClosePreview}
          />
        )}
      </div>
    </div>
  );
}
