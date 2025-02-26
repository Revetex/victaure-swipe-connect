import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { ConnectionsSection } from "./ConnectionsSection";
import { motion } from "framer-motion";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { ProfilePreview } from "@/components/ProfilePreview";
import { Card } from "@/components/ui/card";
import { Search, UserPlus2 } from "lucide-react";
export function FriendsContent() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const handleProfileSelect = async (profile: UserProfile) => {
    setSelectedProfile(profile);
  };
  const handleClosePreview = () => {
    setSelectedProfile(null);
  };
  return <div className="min-h-[calc(100vh-4rem)] space-y-6">
      <motion.div initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3
    }}>
        <Card className="backdrop-blur-md border border-[#64B5D9]/10 shadow-lg hover:shadow-xl transition-all duration-300 p-6 bg-transparent rounded">
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.2
        }} className="flex items-center gap-3 mb-6">
            <UserPlus2 className="w-6 h-6 text-primary dark:text-primary" />
            <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-[#1B2A4A] bg-clip-text text-transparent">
              Trouver des connections
            </h2>
          </motion.div>
          
          <div className="relative">
            <ProfileSearch onSelect={handleProfileSelect} placeholder="Rechercher par nom, compétences, location..." className="w-full bg-white/50 dark:bg-black/50 backdrop-blur-md transition-all focus-within:bg-white/80 dark:focus-within:bg-black/80" />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3,
      delay: 0.1
    }}>
        <ConnectionsSection />
      </motion.div>

      {selectedProfile && <ProfilePreview profile={selectedProfile} isOpen={!!selectedProfile} onClose={handleClosePreview} />}
    </div>;
}