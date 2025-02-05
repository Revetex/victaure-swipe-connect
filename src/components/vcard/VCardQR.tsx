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
        variant="outline"
        size="icon"
        onClick={() => setIsQRDialogOpen(true)}
        className="h-9 w-9"
      >
        <QrCode className="h-4 w-4" />
      </Button>
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="flex flex-col items-center">
          <div className="p-4 bg-white rounded-lg">
            <QRCode value={qrValue} size={200} />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Scannez pour voir le profil
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}