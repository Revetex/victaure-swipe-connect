
import { UserProfile } from "@/types/profile";
import { Dialog, DialogContent } from "./ui/dialog";
import { useConnectionStatus } from "./profile/preview/hooks/useConnectionStatus";
import { useAuth } from "@/hooks/useAuth";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ProfileHeader } from "./profile/sections/ProfileHeader";
import { ProfileOverview } from "./profile/sections/ProfileOverview";
import { ProfileExperience } from "./profile/sections/ProfileExperience";
import { ProfileEducation } from "./profile/sections/ProfileEducation";
import { ProfileCertifications } from "./profile/sections/ProfileCertifications";
import { motion, AnimatePresence } from "framer-motion";

interface VProfileProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function VProfile({ profile, isOpen, onClose }: VProfileProps) {
  const { user } = useAuth();
  const isOwnProfile = user?.id === profile.id;
  const [showFullBio, setShowFullBio] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { isFriend } = useConnectionStatus(profile.id);
  const canViewFullProfile = isOwnProfile || isFriend || !profile.privacy_enabled;
  const truncatedBio = profile.bio?.substring(0, 150);
  const hasBioOverflow = profile.bio && profile.bio.length > 150;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background/95 backdrop-blur-sm">
        <ProfileHeader 
          profile={profile}
          onClose={onClose}
          canViewFullProfile={canViewFullProfile}
        />

        <ScrollArea className="h-[calc(100vh-10rem)] px-6 py-4 custom-scrollbar">
          <Tabs 
            defaultValue="overview" 
            value={activeTab}
            onValueChange={handleTabChange} 
            className="w-full"
          >
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="overview" onClick={() => handleTabChange("overview")}>
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="experience" onClick={() => handleTabChange("experience")}>
                Expérience
              </TabsTrigger>
              <TabsTrigger value="education" onClick={() => handleTabChange("education")}>
                Formation
              </TabsTrigger>
              <TabsTrigger value="certifications" onClick={() => handleTabChange("certifications")}>
                Certifications
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="overview" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                  <ProfileOverview
                    profile={profile}
                    canViewFullProfile={canViewFullProfile}
                    showFullBio={showFullBio}
                    setShowFullBio={setShowFullBio}
                    truncatedBio={truncatedBio}
                    hasBioOverflow={hasBioOverflow}
                  />
                </TabsContent>

                <TabsContent value="experience" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                  <ProfileExperience experiences={profile.experiences} />
                </TabsContent>

                <TabsContent value="education" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                  <ProfileEducation education={profile.education} />
                </TabsContent>

                <TabsContent value="certifications" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                  <ProfileCertifications certifications={profile.certifications} />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
