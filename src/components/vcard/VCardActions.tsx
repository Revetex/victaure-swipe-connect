import { Button } from "@/components/ui/button";
import { Edit3, Download, Share2, Save, X } from "lucide-react";

interface VCardActionsProps {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  onShare: () => void;
  onDownload: () => void;
  onDownloadPDF: () => void;
  onDownloadBusinessPDF: () => void;
  onDownloadCVPDF: () => void;
  onCopyLink: () => void;
  onSave: () => void;
  onApplyChanges: () => void;
}

export function VCardActions({
  isEditing,
  setIsEditing,
  onShare,
  onDownload,
  onDownloadPDF,
  onDownloadBusinessPDF,
  onDownloadCVPDF,
  onCopyLink,
  onSave,
  onApplyChanges,
}: VCardActionsProps) {
  if (isEditing) {
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setIsEditing(false)}
          className="flex-1"
        >
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
        <Button
          onClick={onSave}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Enregistrer
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() => setIsEditing(true)}
        className="flex-1"
      >
        <Edit3 className="h-4 w-4 mr-2" />
        Modifier
      </Button>
      <Button
        variant="outline"
        onClick={onShare}
        className="flex-1"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Partager
      </Button>
      <Button
        variant="outline"
        onClick={onDownload}
        className="flex-1"
      >
        <Download className="h-4 w-4 mr-2" />
        Télécharger
      </Button>
    </div>
  );
}