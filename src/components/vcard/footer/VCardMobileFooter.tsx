import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, Loader2, Save, Share2 } from "lucide-react";
import { StyleOption } from "../types";

interface VCardMobileFooterProps {
  isEditing: boolean;
  isPdfGenerating: boolean;
  isProcessing: boolean;
  selectedStyle: StyleOption;
  onEditToggle: () => void;
  onSave: () => void;
  onDownloadBusinessCard: () => void;
  onDownloadCV: () => void;
  onShare: () => void;
}

export function VCardMobileFooter({
  isEditing,
  isPdfGenerating,
  isProcessing,
  onEditToggle,
  onSave,
  onDownloadBusinessCard,
  onDownloadCV,
  onShare
}: VCardMobileFooterProps) {
  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-background/95 border-t border-border/50 p-4 z-50 safe-area-bottom"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={onEditToggle}
                disabled={isProcessing}
                className="w-full"
              >
                Annuler
              </Button>
              <Button
                onClick={onSave}
                disabled={isProcessing}
                className="w-full"
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
                onClick={onDownloadBusinessCard}
                disabled={isPdfGenerating}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Carte
              </Button>
              <Button
                variant="outline"
                onClick={onDownloadCV}
                disabled={isPdfGenerating}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                CV
              </Button>
              <Button
                variant="ghost"
                onClick={onShare}
                className="w-full col-span-2"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Partager
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}