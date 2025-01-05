import { Button } from "@/components/ui/button";
import { Download, Share2, QrCode } from "lucide-react";
import { generateVCardPDF } from "@/utils/pdf/vcard";
import { Profile } from "@/types/profile";

interface VCardActionsProps {
  profile: Profile;
  onShare?: () => void;
  onShowQR?: () => void;
}

export function VCardActions({ profile, onShare, onShowQR }: VCardActionsProps) {
  const handleDownload = async () => {
    await generateVCardPDF(profile);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={handleDownload}
      >
        <Download className="h-4 w-4" />
        Télécharger
      </Button>
      
      {onShare && (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={onShare}
        >
          <Share2 className="h-4 w-4" />
          Partager
        </Button>
      )}

      {onShowQR && (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={onShowQR}
        >
          <QrCode className="h-4 w-4" />
          QR Code
        </Button>
      )}
    </div>
  );
}