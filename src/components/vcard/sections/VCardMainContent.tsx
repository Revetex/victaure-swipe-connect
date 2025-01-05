import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { VCardHeader } from "../../VCardHeader";
import { VCardContactInfo } from "../VCardContactInfo";
import { UserProfile } from "@/types/profile";
import { Dispatch, SetStateAction } from "react";

interface VCardMainContentProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: Dispatch<SetStateAction<UserProfile>>;
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}

export function VCardMainContent({
  profile,
  isEditing,
  setProfile,
  isExpanded,
  setIsExpanded
}: VCardMainContentProps) {
  return (
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

      {!isExpanded && (
        <motion.div 
          className="shrink-0 sm:ml-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-2 glass-card group hover:scale-105 transition-transform duration-300">
            <QRCodeSVG
              value={window.location.href}
              size={80}
              level="H"
              includeMargin={false}
              className="rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}