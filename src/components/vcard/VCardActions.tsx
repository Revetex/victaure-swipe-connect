import { Button } from "@/components/ui/button";
import { Download, Share2, Link, Save, Edit2, X } from "lucide-react";
import { toast } from "sonner";

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
  const handleCopyLink = () => {
    onCopyLink();
    toast.success("Lien copié !");
  };

  return (
    <div className="flex flex-wrap gap-2">
      {!isEditing ? (
        <>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button variant="outline" size="sm" onClick={onShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            <Link className="h-4 w-4 mr-2" />
            Copier le lien
          </Button>
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" size="sm" onClick={onApplyChanges}>
            <Save className="h-4 w-4 mr-2" />
            Appliquer
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
        </>
      )}
    </div>
  );
}