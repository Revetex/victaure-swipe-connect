import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

export function VCardQRCode() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "p-6 rounded-xl border shadow-lg",
        "bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "transition-all duration-300",
        "hover:shadow-xl hover:scale-[1.02]",
        "w-full max-w-[300px] mx-auto lg:mx-0"
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <QrCode className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Code QR</h3>
      </div>
      
      <div className="flex justify-center bg-white p-4 rounded-lg">
        <QRCodeSVG
          value={window.location.href}
          size={200}
          level="H"
          includeMargin={true}
          className="rounded-lg"
        />
      </div>
      
      <p className="text-sm text-muted-foreground text-center mt-4">
        Scannez pour accéder à mon profil
      </p>
    </motion.div>
  );
}