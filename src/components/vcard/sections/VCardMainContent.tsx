import { VCardHeader } from "@/components/VCardHeader";
import { VCardContactInfo } from "../VCardContactInfo";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

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
  setIsExpanded,
}: VCardMainContentProps) {
  return (
    <motion.div 
      className={`relative ${!isExpanded && 'text-white'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <VCardHeader
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
        setIsEditing={setIsEditing}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
      
      {!isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 space-y-6"
        >
          <VCardContactInfo
            email={profile.email}
            phone={profile.phone}
            city={profile.city}
            state={profile.state}
          />
          <div className="flex justify-center">
            <div className="p-2 glass-card group hover:scale-105 transition-transform duration-300">
              <QRCodeSVG
                value={window.location.href}
                size={80}
                level="H"
                includeMargin={false}
                className="rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}