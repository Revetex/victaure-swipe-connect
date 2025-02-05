import { UserProfile } from "@/types/profile";
import { QrCode, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { VCardActions } from "@/components/VCardActions";

interface VCardHeaderProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  onEditToggle: () => void;
  onSave?: () => void;
  onDownloadBusinessCard?: () => Promise<void>;
}

export function VCardHeader({ 
  profile,
  isEditing,
  setProfile,
  onEditToggle,
  onSave,
  onDownloadBusinessCard
}: VCardHeaderProps) {
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const handleDownload = async () => {
    if (onDownloadBusinessCard) {
      setIsPdfGenerating(true);
      try {
        await onDownloadBusinessCard();
        toast.success("Carte de visite téléchargée");
      } catch (error) {
        toast.error("Échec du téléchargement");
      } finally {
        setIsPdfGenerating(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-primary tracking-tight">
            {isEditing ? (
              <input
                type="text"
                value={profile.full_name || ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0"
                placeholder="Votre nom"
              />
            ) : (
              profile.full_name || 'Profil sans nom'
            )}
          </h2>
          {profile.role && (
            <p className="text-muted-foreground mt-1">
              {isEditing ? (
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0"
                  placeholder="Votre rôle"
                />
              ) : (
                profile.role
              )}
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <VCardActions
            isEditing={isEditing}
            isProcessing={isProcessing}
            isPdfGenerating={isPdfGenerating}
            setIsEditing={onEditToggle}
            onSave={onSave}
            onDownloadBusinessCard={handleDownload}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <img 
          src={profile.avatar_url || '/default-avatar.png'} 
          alt={profile.full_name || 'Profile'} 
          className="w-24 h-24 rounded-full ring-2 ring-primary/20 shadow-md"
        />
        {profile.bio && (
          <p className="text-muted-foreground leading-relaxed">
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 min-h-[100px]"
                placeholder="Votre bio"
              />
            ) : (
              profile.bio
            )}
          </p>
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