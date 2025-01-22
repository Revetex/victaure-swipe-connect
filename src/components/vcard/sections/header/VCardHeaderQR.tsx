import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

interface VCardHeaderQRProps {
  isEditing: boolean;
}

export function VCardHeaderQR({ isEditing }: VCardHeaderQRProps) {
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);

  if (isEditing) {
    return null;
  }

  return (
    <>
      <motion.div 
        className="shrink-0 cursor-pointer hidden sm:block"
        onClick={() => setIsQRDialogOpen(true)}
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="p-2 glass-card">
          <QRCodeSVG
            value={window.location.href}
            size={80}
            level="H"
            includeMargin={false}
            className="rounded-lg opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </motion.div>

      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-sm border-none">
          <div className="flex flex-col items-center space-y-4 p-6">
            <QRCodeSVG
              value={window.location.href}
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