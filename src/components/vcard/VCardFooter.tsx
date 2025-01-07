import { VCardActions } from "./VCardActions";
import { StyleOption } from "./types";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface VCardFooterProps {
  isEditing: boolean;
  isPdfGenerating: boolean;
  isProcessing: boolean;
  selectedStyle: StyleOption;
  onEditToggle: () => void;
  onSave: () => void;
  onDownloadBusinessCard: () => Promise<void>;
  onDownloadCV: () => Promise<void>;
}

export function VCardFooter({
  isEditing,
  isPdfGenerating,
  isProcessing,
  selectedStyle,
  onEditToggle,
  onSave,
  onDownloadBusinessCard,
  onDownloadCV,
}: VCardFooterProps) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Mon profil professionnel',
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Lien copié dans le presse-papier");
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error("Erreur lors du partage");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <VCardActions
          isEditing={isEditing}
          isPdfGenerating={isPdfGenerating}
          isProcessing={isProcessing}
          setIsEditing={() => onEditToggle()}
          onSave={onSave}
          onDownloadBusinessPDF={onDownloadBusinessCard}
          onDownloadCVPDF={onDownloadCV}
          selectedStyle={selectedStyle}
        />
      </div>
      
      {!isEditing && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full sm:w-auto"
            style={{ 
              borderColor: `${selectedStyle.colors.primary}40`,
              color: selectedStyle.colors.text.primary,
            }}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Partager mon profil
          </Button>
        </div>
      )}
    </div>
  );
}