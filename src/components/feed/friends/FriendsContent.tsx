
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfile } from "@/types/profile";
import { cn } from "@/lib/utils";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { Card, CardContent } from "@/components/ui/card";
import { Search, UserPlus2 } from "lucide-react";
import { ProfilePreview } from "@/components/ProfilePreview";
import { ConnectionsSection } from "./ConnectionsSection";

export function FriendsContent() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const handleProfileSelect = async (profile: UserProfile) => {
    setSelectedProfile(profile);
  };

  const handleClosePreview = () => {
    setSelectedProfile(null);
  };

  return (
    <motion.main 
      className="max-w-3xl mx-auto px-4 py-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className={cn(
        "bg-background/80 dark:bg-zinc-900/80",
        "backdrop-blur-xl border-none shadow-lg"
      )}>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <UserPlus2 className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-medium text-foreground">
              Trouver des connections
            </h2>
          </div>
          
          <div className="relative">
            <ProfileSearch 
              onSelect={handleProfileSelect}
              placeholder="Rechercher par nom, compétences, location..."
              className="w-full bg-background/50 dark:bg-zinc-800/50 backdrop-blur-sm"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <ConnectionsSection />

      <AnimatePresence>
        {selectedProfile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/30 backdrop-blur-sm"
          >
            <ProfilePreview
              profile={selectedProfile}
              isOpen={!!selectedProfile}
              onClose={handleClosePreview}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
