import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useVCardStyle } from "./VCardStyleContext";

export function VCardQRCode() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedStyle } = useVCardStyle();
  const currentUrl = window.location.href;

  return (
    <>
      <motion.div 
        className="absolute top-4 right-4 p-2 glass-card group hover:scale-105 transition-transform duration-300 cursor-pointer z-10"
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsOpen(true)}
      >
        <QRCodeSVG
          value={currentUrl}
          size={80}
          level="H"
          includeMargin={false}
          className="rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        />
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-sm border-none">
          <div className="flex flex-col items-center space-y-4 p-6">
            <QRCodeSVG
              value={currentUrl}
              size={250}
              level="H"
              includeMargin={true}
              className="rounded-lg"
            />
            <p className="text-sm text-muted-foreground text-center">
              Scannez ce code QR pour accéder à mon profil professionnel
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}