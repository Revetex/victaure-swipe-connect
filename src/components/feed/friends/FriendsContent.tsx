import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { ConnectionsSection } from "./ConnectionsSection";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  return <div className="min-h-[calc(100vh-4rem)] relative z-0 space-y-6">
      <motion.div initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3
    }}>
        <Card className="">
          <div className="flex items-center gap-3 mb-6">
            <UserPlus2 className="w-6 h-6 text-primary dark:text-[#9b87f5]" />
            <h2 className="text-xl font-semibold bg-gradient-to-r from-primary/90 to-primary dark:from-[#9b87f5] dark:to-[#7E69AB] bg-clip-text text-transparent">
              Trouver des connections
            </h2>
          </div>
          
          <div className="relative">
            <ProfileSearch onSelect={handleProfileSelect} placeholder="Rechercher par nom, compétences, location..." className="w-full" />
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