import { UserProfile } from "@/types/profile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { VCardHeader } from "./vcard/sections/VCardHeader";
import { VCardContact } from "./vcard/sections/VCardContact";
import { VCardSkills } from "./vcard/sections/VCardSkills";
import { VCardCertifications } from "./vcard/sections/VCardCertifications";
import { VCardEducation } from "./vcard/sections/VCardEducation";
import { VCardExperience } from "./vcard/sections/VCardExperience";

interface VCardProps {
  profile: UserProfile;
  isPublicView?: boolean;
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
}

export function VCard({ profile, isPublicView = false, onEditStateChange, onRequestChat }: VCardProps) {
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Aucune donnée de profil disponible</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "vcard space-y-8 p-6 rounded-xl bg-background/95 backdrop-blur-sm border border-border/50",
      "shadow-lg hover:shadow-xl transition-all duration-300",
      isPublicView ? 'public' : 'private'
    )}>
      <VCardHeader profile={profile} />
      <VCardContact profile={profile} />
      <VCardSkills profile={profile} />
      <VCardCertifications profile={profile} />
      <VCardEducation profile={profile} />
      <VCardExperience profile={profile} />
    </div>
  );
}