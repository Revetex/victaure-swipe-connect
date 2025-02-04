import { Button } from "@/components/ui/button";
import { FileText, Pencil, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2"
      >
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
        >
          <Save className="h-4 w-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2"
    >
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
        className={cn(
          "shrink-0 relative overflow-hidden",
          "bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600",
          "hover:from-purple-600 hover:via-blue-600 hover:to-purple-700",
          "text-white shadow-lg hover:shadow-xl transition-all duration-300",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
          "before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000",
          isPdfGenerating && "opacity-50 pointer-events-none"
        )}
        title="Télécharger la carte de visite"
      >
        <FileText className="h-4 w-4 relative z-10" />
      </Button>
    </motion.div>
  );
}