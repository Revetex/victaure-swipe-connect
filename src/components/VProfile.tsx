
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  const { isFriend } = useConnectionStatus(profile.id);
  const canViewFullProfile = isOwnProfile || isFriend || !profile.privacy_enabled;
  const truncatedBio = profile.bio?.substring(0, 150);
  const hasBioOverflow = profile.bio && profile.bio.length > 150;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] h-[90vh] p-0' : 'max-w-4xl p-0'} overflow-hidden bg-background/95 backdrop-blur-sm shadow-xl rounded-xl border border-border/30`}>
        <ProfileHeader 
          profile={profile}
          onClose={onClose}
          canViewFullProfile={canViewFullProfile}
        />

        <ScrollArea className={`h-[calc(100vh-${isMobile ? '14rem' : '10rem'})] custom-scrollbar`}>
          <div className="px-4 sm:px-6 py-4">
            <Tabs 
              defaultValue="overview" 
              value={activeTab}
              onValueChange={handleTabChange} 
              className="w-full"
            >
              <TabsList className={`w-full sm:w-auto mx-auto flex justify-center mb-6 p-1 bg-background/50 border border-border/20 rounded-xl`}>
                <TabsTrigger 
                  value="overview" 
                  onClick={() => handleTabChange("overview")}
                  className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  Vue d'ensemble
                </TabsTrigger>
                <TabsTrigger 
                  value="experience" 
                  onClick={() => handleTabChange("experience")}
                  className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  Expérience
                </TabsTrigger>
                <TabsTrigger 
                  value="education" 
                  onClick={() => handleTabChange("education")}
                  className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  Formation
                </TabsTrigger>
                <TabsTrigger 
                  value="certifications" 
                  onClick={() => handleTabChange("certifications")}
                  className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  Certifications
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="py-2"
                >
                  <TabsContent value="overview" className="space-y-6 focus-visible:outline-none focus-visible:ring-0 mt-0">
                    <ProfileOverview
                      profile={profile}
                      canViewFullProfile={canViewFullProfile}
                      showFullBio={showFullBio}
                      setShowFullBio={setShowFullBio}
                      truncatedBio={truncatedBio}
                      hasBioOverflow={hasBioOverflow}
                    />
                  </TabsContent>

                  <TabsContent value="experience" className="space-y-6 focus-visible:outline-none focus-visible:ring-0 mt-0">
                    <ProfileExperience experiences={profile.experiences} />
                  </TabsContent>

                  <TabsContent value="education" className="space-y-6 focus-visible:outline-none focus-visible:ring-0 mt-0">
                    <ProfileEducation education={profile.education} />
                  </TabsContent>

                  <TabsContent value="certifications" className="space-y-6 focus-visible:outline-none focus-visible:ring-0 mt-0">
                    <ProfileCertifications profile={profile} />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
