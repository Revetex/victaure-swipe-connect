import { Button } from "@/components/ui/button";
import { Share, Download, Edit2, Save, Loader2 } from "lucide-react";
import { StyleOption } from "./types";
import { useVCardHandlers } from "./handlers/useVCardHandlers";
import { useProfile } from "@/hooks/useProfile";
import { motion } from "framer-motion";

interface VCardFooterProps {
  isEditing: boolean;
  isPdfGenerating: boolean;
  isProcessing: boolean;
  selectedStyle: StyleOption;
  onEditToggle: () => void;
  onSave: () => void;
  onDownloadBusinessCard: () => void;
  onDownloadCV: () => void;
}

export function VCardFooter({
  isEditing,
  isPdfGenerating,
  isProcessing,
  selectedStyle,
  onEditToggle,
  onSave,
  onDownloadBusinessCard,
  onDownloadCV
}: VCardFooterProps) {
  const { profile } = useProfile();
  const { handleShare } = useVCardHandlers();

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 bg-background/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-border/50 dark:border-gray-800 p-4 pb-safe-bottom z-50"
    >
      <div className="container mx-auto flex flex-col gap-4 max-w-lg">
        <div className="flex items-center justify-between gap-4">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={onEditToggle}
                disabled={isProcessing}
                className="flex-1 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                Annuler
              </Button>
              <Button
                onClick={onSave}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onEditToggle}
                className="flex-1 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Modifier
              </Button>
              <Button
                variant="outline"
                onClick={onDownloadBusinessCard}
                disabled={isPdfGenerating}
                className="flex-1 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <Download className="mr-2 h-4 w-4" />
                Carte
              </Button>
              <Button
                variant="outline"
                onClick={onDownloadCV}
                disabled={isPdfGenerating}
                className="flex-1 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <Download className="mr-2 h-4 w-4" />
                CV
              </Button>
            </>
          )}
        </div>
        {!isEditing && (
          <Button
            variant="ghost"
            onClick={() => profile && handleShare(profile)}
            className="w-full dark:hover:bg-gray-800"
          >
            <Share className="mr-2 h-4 w-4" />
            Partager
          </Button>
        )}
      </div>
    </motion.div>
  );
}