import { Button } from "@/components/ui/button";
import { Download, Edit2, Save } from "lucide-react";
import { toast } from "sonner";
import { generateVCardPDF } from "@/utils/pdfGenerator";
import { UserProfile } from "@/types/profile";
import { StyleOption } from "./types";

interface VCardActionsProps {
  isEditing: boolean;
  isPdfGenerating: boolean;
  profile: UserProfile;
  selectedStyle: StyleOption;
  onEditToggle: () => void;
  onSave: () => Promise<void>;
}

export function VCardActions({
  isEditing,
  isPdfGenerating,
  profile,
  selectedStyle,
  onEditToggle,
  onSave
}: VCardActionsProps) {
  const handleDownloadPDF = async () => {
    if (!profile) {
      toast.error("Aucun profil trouvé");
      return;
    }

    try {
      await generateVCardPDF(profile, selectedStyle.color);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Erreur lors de la génération du PDF. Veuillez réessayer.");
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-white/20">
      {isEditing ? (
        <Button
          onClick={onSave}
          style={{ backgroundColor: selectedStyle.color }}
          className="text-white transition-colors"
        >
          <Save className="mr-2 h-4 w-4" />
          Sauvegarder
        </Button>
      ) : (
        <Button
          onClick={onEditToggle}
          style={{ backgroundColor: selectedStyle.color }}
          className="text-white transition-colors"
        >
          <Edit2 className="mr-2 h-4 w-4" />
          Modifier mon profil
        </Button>
      )}

      <Button
        onClick={handleDownloadPDF}
        disabled={isPdfGenerating}
        style={{ backgroundColor: selectedStyle.color }}
        className="text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="mr-2 h-4 w-4" />
        {isPdfGenerating ? 'Génération...' : 'Télécharger PDF'}
      </Button>
    </div>
  );
}