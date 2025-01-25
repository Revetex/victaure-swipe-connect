import { Share2, Edit, FileText, Copy } from "lucide-react";
import { VCardActionButton } from "./VCardActionButton";
import { toast } from "sonner";

interface VCardViewingActionsProps {
  onEditToggle: () => void;
  onDownloadBusinessCard: () => Promise<void>;
  onDownloadCV: () => Promise<void>;
  isPdfGenerating: boolean;
  profile: any;
}

export function VCardViewingActions({
  onEditToggle,
  onDownloadBusinessCard,
  onDownloadCV,
  isPdfGenerating,
  profile
}: VCardViewingActionsProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.full_name || '',
          text: `Profil professionnel de ${profile.full_name || ''}`,
          url: window.location.href,
        });
        toast.success("Profil partagé avec succès");
      } catch (error) {
        console.error('Error sharing:', error);
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Lien copié dans le presse-papier");
  };

  return (
    <>
      <div className="flex-1 min-w-[100px]">
        <VCardActionButton
          icon={Share2}
          label="Partager"
          onClick={handleShare}
          className="w-full"
        />
      </div>
      <div className="flex-1 min-w-[100px]">
        <VCardActionButton
          icon={Edit}
          label="Mode édition"
          onClick={onEditToggle}
          variant="secondary"
          className="w-full"
        />
      </div>
      <div className="flex-1 min-w-[100px]">
        <VCardActionButton
          icon={FileText}
          label="Business PDF"
          onClick={onDownloadBusinessCard}
          variant="secondary"
          disabled={isPdfGenerating}
          className="w-full"
        />
      </div>
      <div className="flex-1 min-w-[100px]">
        <VCardActionButton
          icon={FileText}
          label="CV PDF"
          onClick={onDownloadCV}
          variant="secondary"
          disabled={isPdfGenerating}
          className="w-full"
        />
      </div>
      <div>
        <VCardActionButton
          icon={Copy}
          label=""
          onClick={handleCopyLink}
          variant="secondary"
        />
      </div>
    </>
  );
}