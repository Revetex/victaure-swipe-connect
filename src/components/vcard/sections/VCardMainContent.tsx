import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { VCardHeader } from "../../VCardHeader";
import { VCardContactInfo } from "../VCardContactInfo";

interface VCardMainContentProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
  setIsEditing: (isEditing: boolean) => void;
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}

export function VCardMainContent({
  profile,
  isEditing,
  setProfile,
  setIsEditing,
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
          setIsEditing={setIsEditing}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <VCardContactInfo
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        </motion.div>
      </div>

      {!isEditing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-shrink-0"
        >
          <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-700">
            <QRCodeSVG
              value={window.location.href}
              size={120}
              level="H"
              includeMargin={true}
              className="rounded-lg"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}