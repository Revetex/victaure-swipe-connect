import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useProfile } from "@/hooks/useProfile";
import { useIsMobile } from "@/hooks/use-mobile";

export function VCardQRCode() {
  const { profile } = useProfile();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  // Generate the profile URL
  const profileUrl = `${window.location.origin}/profile/${profile?.id}`;

  // Determine QR code colors based on theme
  const qrColors = {
    dark: {
      dark: '#FFFFFF',
      light: '#00000000'
    },
    light: {
      dark: '#1F2937',
      light: '#FFFFFF00'
    }
  };

  const selectedColors = theme === 'dark' ? qrColors.dark : qrColors.light;
  const size = isMobile ? 80 : 100;

  return (
    <motion.div 
      className="shrink-0 sm:ml-4"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="p-3 glass-card group hover:scale-105 transition-transform duration-300 bg-background/30 backdrop-blur-sm border border-border dark:border-border/20">
        <QRCodeSVG
          value={profileUrl}
          size={size}
          level="H"
          includeMargin={false}
          className="rounded-lg transition-opacity duration-300"
          bgColor={selectedColors.light}
          fgColor={selectedColors.dark}
        />
      </div>
    </motion.div>
  );
}