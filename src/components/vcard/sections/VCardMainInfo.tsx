import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { VCardHeader } from "../../VCardHeader";
import { VCardContactInfo } from "../VCardContactInfo";

interface VCardMainInfoProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
  setIsEditing: (isEditing: boolean) => void;
  isExpanded: boolean;
}

export function VCardMainInfo({
  profile,
  isEditing,
  setProfile,
  setIsEditing,
  isExpanded
}: VCardMainInfoProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
      <div className="flex-1 min-w-0">
        <VCardHeader
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
          setIsEditing={setIsEditing}
        />

        {!isExpanded && (
          <VCardContactInfo
            email={profile.email}
            phone={profile.phone}
            city={profile.city}
            state={profile.state}
          />
        )}
      </div>

      {!isExpanded && (
        <motion.div 
          className="shrink-0 sm:ml-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <QRCodeSVG
              value={window.location.href}
              size={80}
              level="H"
              includeMargin={false}
              className="rounded-lg"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}