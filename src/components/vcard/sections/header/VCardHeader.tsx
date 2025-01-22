import { motion } from "framer-motion";
import { UserProfile } from "@/types/profile";
import { VCardAvatar } from "./VCardAvatar";
import { VCardHeaderName } from "./VCardHeaderName";
import { VCardHeaderQR } from "./VCardHeaderQR";
import { useVCardStyle } from "../../VCardStyleContext";

interface VCardHeaderProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardHeader({ profile, isEditing, setProfile }: VCardHeaderProps) {
  const { selectedStyle } = useVCardStyle();

  const handleProfileChange = (updates: Partial<UserProfile>) => {
    setProfile({ ...profile, ...updates });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4"
      style={{ 
        fontFamily: profile.custom_font || selectedStyle.font,
        color: profile.custom_text_color || selectedStyle.colors.text.primary
      }}
    >
      <VCardAvatar 
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
      />

      <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
        <VCardHeaderName
          profile={profile}
          isEditing={isEditing}
          onProfileChange={handleProfileChange}
        />
      </div>

      <VCardHeaderQR isEditing={isEditing} />
    </motion.div>
  );
}