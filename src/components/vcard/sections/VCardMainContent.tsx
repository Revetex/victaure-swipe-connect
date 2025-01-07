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
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10 rounded-xl opacity-50"
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.02, 1]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <div className="relative z-10 flex flex-col sm:flex-row items-start justify-between gap-6 p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
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
              className="mt-4"
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