import { Button } from "@/components/ui/button";
import { Profile } from "@/types/profile";
import { StyleOption } from "./types";
import { Download, Edit, Save, X } from "lucide-react";

interface VCardActionsProps {
  isEditing: boolean;
  isPdfGenerating: boolean;
  profile: Profile;
  selectedStyle: StyleOption;
  onEditToggle: () => void;
  onSave: () => void;
  onDownloadVCard: () => void;
  onDownloadBusinessCard: () => void;
  onDownloadCV: () => void;
}

export function VCardActions({
  isEditing,
  isPdfGenerating,
  onEditToggle,
  onSave,
  onDownloadVCard,
  onDownloadBusinessCard,
  onDownloadCV,
}: VCardActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <>
          <Button onClick={onSave} disabled={isPdfGenerating}>
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
          <Button variant="ghost" onClick={onEditToggle}>
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" onClick={onEditToggle}>
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          <Button
            variant="outline"
            onClick={onDownloadVCard}
            disabled={isPdfGenerating}
          >
            <Download className="w-4 h-4 mr-2" />
            VCard
          </Button>
          <Button
            variant="outline"
            onClick={onDownloadBusinessCard}
            disabled={isPdfGenerating}
          >
            <Download className="w-4 h-4 mr-2" />
            Carte
          </Button>
          <Button
            variant="outline"
            onClick={onDownloadCV}
            disabled={isPdfGenerating}
          >
            <Download className="w-4 h-4 mr-2" />
            CV
          </Button>
        </>
      )}
    </div>
  );
}