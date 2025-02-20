
import { UserProfile } from "@/types/profile";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
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

interface VProfileProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function VProfile({ profile, isOpen, onClose }: VProfileProps) {
  const { user } = useAuth();
  const isOwnProfile = user?.id === profile.id;
  const [showFullBio, setShowFullBio] = useState(false);

  const { isFriend } = useConnectionStatus(profile.id);
  const canViewFullProfile = isOwnProfile || isFriend || !profile.privacy_enabled;
  const truncatedBio = profile.bio?.substring(0, 150);
  const hasBioOverflow = profile.bio && profile.bio.length > 150;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background/95 backdrop-blur-sm">
        <VisuallyHidden asChild>
          <DialogTitle>Profil de {profile.full_name || "Utilisateur"}</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DialogDescription>
            Informations détaillées du profil de {profile.full_name || "l'utilisateur"}
          </DialogDescription>
        </VisuallyHidden>
        
        <ProfileHeader 
          profile={profile}
          onClose={onClose}
          canViewFullProfile={canViewFullProfile}
        />

        <ScrollArea className="h-[calc(100vh-10rem)] px-6 py-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="experience">Expérience</TabsTrigger>
              <TabsTrigger value="education">Formation</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ProfileOverview
                profile={profile}
                canViewFullProfile={canViewFullProfile}
                showFullBio={showFullBio}
                setShowFullBio={setShowFullBio}
                truncatedBio={truncatedBio}
                hasBioOverflow={hasBioOverflow}
              />
            </TabsContent>

            <TabsContent value="experience">
              <ProfileExperience experiences={profile.experiences} />
            </TabsContent>

            <TabsContent value="education">
              <ProfileEducation education={profile.education} />
            </TabsContent>

            <TabsContent value="certifications">
              <ProfileCertifications certifications={profile.certifications} />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
