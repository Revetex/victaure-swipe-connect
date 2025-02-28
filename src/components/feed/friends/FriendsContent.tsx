
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { ConnectionsSection } from "./ConnectionsSection";
import { motion } from "framer-motion";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { ProfilePreview } from "@/components/ProfilePreview";
import { Card } from "@/components/ui/card";
import { Search, UserPlus2 } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const searchCardVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
};

const connectionsVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export function FriendsContent() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const handleProfileSelect = async (profile: UserProfile) => {
    setSelectedProfile(profile);
  };

  const handleClosePreview = () => {
    setSelectedProfile(null);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-[calc(100vh-4rem)] space-y-6 pattern-dots"
    >
      <motion.div variants={searchCardVariants} transition={{ duration: 0.3 }}>
        <Card className="glass-panel p-6 hover-lift">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <UserPlus2 className="w-6 h-6 text-[#64B5D9]" />
            <h2 className="text-xl font-semibold text-gradient-primary">
              Trouver des connexions
            </h2>
          </motion.div>
          
          <div className="relative">
            <ProfileSearch 
              onSelect={handleProfileSelect}
              placeholder="Rechercher par nom, compétences, location..."
              className="w-full bg-white/5 backdrop-blur-md 
                         transition-all duration-300
                         focus-within:bg-white/10
                         border-white/10 focus-within:border-[#64B5D9]/30
                         text-white placeholder-white/50"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
          </div>
        </Card>
      </motion.div>

      <motion.div 
        variants={connectionsVariants} 
        transition={{ duration: 0.3, delay: 0.1 }}
        className="glass-panel p-4"
      >
        <ConnectionsSection />
      </motion.div>

      {selectedProfile && (
        <ProfilePreview
          profile={selectedProfile}
          isOpen={true}
          onClose={handleClosePreview}
        />
      )}
    </motion.div>
  );
}
