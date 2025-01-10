import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";

export function VCardQRCode() {
  const { profile } = useProfile();
  
  // Generate the profile URL
  const profileUrl = `${window.location.origin}/profile/${profile?.id}`;

  return (
    <motion.div 
      className="shrink-0 sm:ml-4"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="p-3 glass-card group hover:scale-105 transition-transform duration-300 bg-black/30 border border-white/20 hover:border-white/30">
        <QRCodeSVG
          value={profileUrl}
          size={80}
          level="H"
          includeMargin={false}
          className="rounded-lg opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          bgColor="transparent"
          fgColor="#e6e6e6"
        />
      </div>
    </motion.div>
  );
}