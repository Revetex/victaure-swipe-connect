import { Button } from "@/components/ui/button";
import { FileText, Pencil, Save, Share2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface VCardActionsProps {
  isEditing: boolean;
  isProcessing?: boolean;
  isPdfGenerating?: boolean;
  setIsEditing: (isEditing: boolean) => void;
  onSave?: () => void;
  onDownloadBusinessCard?: () => Promise<void>;
}

export function VCardActions({
  isEditing,
  isProcessing,
  isPdfGenerating,
  setIsEditing,
  onSave,
  onDownloadBusinessCard,
}: VCardActionsProps) {
  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(false)}
          className="shrink-0"
          title="Annuler"
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          onClick={onSave}
          size="icon"
          className={cn("shrink-0", isProcessing && "opacity-50 pointer-events-none")}
          title="Sauvegarder"
        >
          <Save className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsEditing(true)}
        className="shrink-0"
        title="Éditer"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDownloadBusinessCard}
        className={cn("shrink-0", isPdfGenerating && "opacity-50 pointer-events-none")}
        title="Télécharger la carte de visite"
      >
        <FileText className="h-4 w-4" />
      </Button>
    </div>
  );
}