import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { QrCode } from "lucide-react";

export function VCardQRCode() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-white rounded-lg border shadow-lg space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <QrCode className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Code QR</h3>
      </div>
      
      <div className="flex justify-center">
        <QRCodeSVG
          value={window.location.href}
          size={200}
          level="H"
          includeMargin={true}
          className="rounded-lg"
        />
      </div>
      
      <p className="text-sm text-muted-foreground text-center">
        Scannez pour accéder à mon profil
      </p>
    </motion.div>
  );
}