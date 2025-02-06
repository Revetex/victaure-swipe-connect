import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { UserProfile } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";
import { FriendRequestsSection } from "./FriendRequestsSection";
import { ConnectionsSection } from "./ConnectionsSection";
import { UserPlus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function FriendsContent() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="relative"
        variants={itemVariants}
      >
        <ProfileSearch 
          onSelect={setSelectedProfile}
          placeholder="Rechercher un contact..."
          className="w-full bg-background/95 backdrop-blur"
        />
        <UserPlus className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </motion.div>

      <motion.div 
        className="space-y-6"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Mes connections</span>
        </div>

        <motion.div variants={itemVariants}>
          <ConnectionsSection />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FriendRequestsSection />
        </motion.div>
      </motion.div>

      {selectedProfile && (
        <ProfilePreview
          profile={selectedProfile}
          isOpen={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </motion.div>
  );
}