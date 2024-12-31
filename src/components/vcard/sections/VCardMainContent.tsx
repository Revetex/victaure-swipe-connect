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
            email={profile.email}
            phone={profile.phone}
            city={profile.city}
            state={profile.state}
          />
        </motion.div>
      </div>

      {!isEditing && !isExpanded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative shrink-0"
        >
          <div className="absolute inset-0 bg-circuit-pattern opacity-20" />
          <div className="relative p-3 bg-victaure-metal/30 rounded-lg backdrop-blur-sm border border-victaure-blue/20 shadow-lg">
            <div className="absolute -inset-px bg-gradient-to-tr from-victaure-blue/20 to-transparent rounded-lg" />
            <div className="relative">
              <div className="absolute -inset-3 bg-circuit-pattern opacity-10" />
              <div className="relative bg-black/30 p-2 rounded">
                <QRCodeSVG
                  value={window.location.href}
                  size={70}
                  level="H"
                  includeMargin={false}
                  className="rounded opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-victaure-blue/5 to-transparent" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-victaure-blue/40 rounded-full animate-pulse" />
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-victaure-blue/40 rounded-full animate-pulse" />
              <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 bg-victaure-blue/40 rounded-full animate-pulse delay-100" />
              <div className="absolute top-1/2 -left-1 w-1.5 h-1.5 bg-victaure-blue/40 rounded-full animate-pulse delay-100" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}