import { Button } from "@/components/ui/button";
import { Edit, Save, FileText, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface VCardActionsProps {
  isEditing: boolean;
  isProcessing?: boolean;
  isPdfGenerating?: boolean;
  setIsEditing: (isEditing: boolean) => void;
  onSave?: () => void;
  onDownloadBusinessCard?: () => Promise<void>;
  onDownloadCV?: () => Promise<void>;
}

export function VCardActions({
  isEditing,
  isProcessing,
  isPdfGenerating,
  setIsEditing,
  onSave,
  onDownloadBusinessCard,
  onDownloadCV
}: VCardActionsProps) {
  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(false)}
          className={cn(
            "shrink-0 hover:bg-purple-100 dark:hover:bg-purple-900/20",
            "text-purple-600 dark:text-purple-400"
          )}
          title="Annuler"
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          onClick={onSave}
          size="icon"
          className={cn(
            "shrink-0 bg-purple-600 hover:bg-purple-700 text-white",
            "dark:bg-purple-500 dark:hover:bg-purple-600",
            isProcessing && "opacity-50 pointer-events-none"
          )}
          title="Sauvegarder"
          disabled={isProcessing}
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
        <Edit className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onDownloadBusinessCard}
        className={cn(
          "shrink-0",
          isPdfGenerating && "opacity-50 pointer-events-none"
        )}
        disabled={isPdfGenerating}
        title="Télécharger la carte de visite"
      >
        <FileText className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onDownloadCV}
        className={cn(
          "shrink-0",
          isPdfGenerating && "opacity-50 pointer-events-none"
        )}
        disabled={isPdfGenerating}
        title="Télécharger le CV"
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}