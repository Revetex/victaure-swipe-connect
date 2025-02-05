import { UserProfile } from "@/types/profile";
import { QrCode, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";

interface VCardHeaderProps {
  profile: UserProfile;
}

export function VCardHeader({ profile }: VCardHeaderProps) {
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);

  const handleDownloadBusinessCard = async () => {
    try {
      // Implement PDF generation logic here
      toast.success("Carte de visite téléchargée");
    } catch (error) {
      toast.error("Échec du téléchargement");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-primary tracking-tight">
          {profile.full_name || 'Profil sans nom'}
        </h2>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsQRDialogOpen(true)}
            className="rounded-full"
          >
            <QrCode className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDownloadBusinessCard}
            className="rounded-full"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <img 
          src={profile.avatar_url || '/default-avatar.png'} 
          alt={profile.full_name || 'Profile'} 
          className="w-24 h-24 rounded-full ring-2 ring-primary/20 shadow-md"
        />
        {profile.bio && (
          <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
        )}
      </div>

      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center space-y-4 p-6">
            <QRCodeSVG
              value={window.location.href}
              size={200}
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
    </div>
  );
}