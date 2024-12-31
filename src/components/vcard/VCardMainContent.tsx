import { VCardHeader } from "@/components/VCardHeader";
import { VCardContactInfo } from "./VCardContactInfo";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

interface VCardMainContentProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}

export function VCardMainContent({
  profile,
  isEditing,
  setProfile,
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
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex-1 min-w-0">
          <VCardHeader
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
          
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
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

        {!isExpanded && (
          <motion.div 
            className="hidden sm:block shrink-0"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-2 glass-card group hover:scale-105 transition-transform duration-300">
              <QRCodeSVG
                value={window.location.href}
                size={85}
                level="H"
                includeMargin={false}
                className="rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}