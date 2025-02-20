import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface VCardQRProps {
  isQRDialogOpen: boolean;
  setIsQRDialogOpen: (open: boolean) => void;
  profileId: string;
}

export function VCardQR({ isQRDialogOpen, setIsQRDialogOpen, profileId }: VCardQRProps) {
  const isMobile = useIsMobile();
  const publicProfileUrl = `${window.location.origin}/profile/${profileId}`;
  const logoUrl = "/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png";

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
            value={publicProfileUrl}
            size={60}
            level="H"
            includeMargin={false}
            className="rounded-lg opacity-70 hover:opacity-100 transition-opacity duration-300"
            imageSettings={{
              src: logoUrl,
              height: 20,
              width: 20,
              excavate: true,
            }}
          />
        </div>
      </motion.div>

      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className={cn(
          "sm:max-w-md bg-background/95 backdrop-blur-sm border-none",
          isMobile && "w-[90vw] max-h-[90vh]"
        )}>
          <div className="flex flex-col items-center space-y-4 p-6">
            <QRCodeSVG
              value={publicProfileUrl}
              size={isMobile ? 250 : 300}
              level="H"
              includeMargin={true}
              className="rounded-lg"
              imageSettings={{
                src: logoUrl,
                height: isMobile ? 80 : 100,
                width: isMobile ? 80 : 100,
                excavate: true,
              }}
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
