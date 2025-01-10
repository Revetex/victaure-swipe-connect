import { motion } from "framer-motion";
import { VCardHeader } from "../../VCardHeader";
import { VCardContactInfo } from "../VCardContactInfo";
import { VCardQRCode } from "../VCardQRCode";
import { UserProfile } from "@/types/profile";

interface VCardMainContentProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}

export function VCardMainContent({
  profile,
  isEditing,
  setProfile,
  isExpanded,
  setIsExpanded
}: VCardMainContentProps) {
  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <VCardHeader
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />

          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <VCardContactInfo
                email={profile.email}
                phone={profile.phone}
                city={profile.city}
                state={profile.state}
              />
            </motion.div>
          )}
        </div>

        {!isExpanded && <VCardQRCode />}
      </div>
    </div>
  );
}