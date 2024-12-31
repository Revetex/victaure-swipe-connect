import { VCardHeader } from "@/components/VCardHeader";
import { VCardContactInfo } from "./VCardContactInfo";
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
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <VCardHeader
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
              setIsEditing={setIsEditing}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
            />
          </div>

          {!isExpanded && (
            <motion.div 
              className="shrink-0"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-1.5 glass-card group hover:scale-105 transition-transform duration-300">
                <QRCodeSVG
                  value={window.location.href}
                  size={64}
                  level="H"
                  includeMargin={false}
                  className="rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </motion.div>
          )}
        </div>
          
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
    </motion.div>
  );
}