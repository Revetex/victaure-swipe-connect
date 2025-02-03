import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface VCardQRProps {
  isQRDialogOpen: boolean;
  setIsQRDialogOpen: (open: boolean) => void;
}

export function VCardQR({ isQRDialogOpen, setIsQRDialogOpen }: VCardQRProps) {
  return (
    <>
      <motion.div 
        className="shrink-0 cursor-pointer"
        onClick={() => setIsQRDialogOpen(true)}
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="p-2 sm:p-3 bg-card/5 backdrop-blur-md rounded-xl border border-border/10 shadow-sm">
          <QRCodeSVG
            value={window.location.href}
            size={60}
            level="H"
            includeMargin={false}
            className="rounded-lg opacity-70 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </motion.div>

      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-sm border-none">
          <div className="flex flex-col items-center space-y-4 p-6">
            <QRCodeSVG
              value={window.location.href}
              size={200}
              level="H"
              includeMargin={true}
              className="rounded-lg"
            />
            <p className="text-xs sm:text-sm text-muted-foreground text-center">
              Scannez ce code QR pour accéder à mon profil professionnel
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}