import QRCode from "react-qr-code";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

interface VCardQRProps {
  isQRDialogOpen: boolean;
  setIsQRDialogOpen: (open: boolean) => void;
  profileId: string;
}

export function VCardQR({ isQRDialogOpen, setIsQRDialogOpen, profileId }: VCardQRProps) {
  const qrValue = `${window.location.origin}/profile/${profileId}`;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsQRDialogOpen(true)}
        className="rounded-full"
      >
        <QrCode className="h-4 w-4" />
      </Button>

      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center justify-center p-4">
            <QRCode value={qrValue} />
            <p className="mt-4 text-sm text-muted-foreground">
              Scannez ce QR code pour accéder au profil
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}