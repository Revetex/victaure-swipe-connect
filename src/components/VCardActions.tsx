import { Button } from "@/components/ui/button";
import { Share2, FileText, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { useVCardStyle } from "./vcard/VCardStyleContext";
import { cn } from "@/lib/utils";

interface VCardActionsProps {
  isEditing: boolean;
  onShare: () => void;
  onDownloadBusinessPDF: () => void;
  onDownloadCVPDF: () => void;
  onSave: () => void;
  onApplyChanges: () => void;
  setIsEditing: (isEditing: boolean) => void;
}

export function VCardActions({
  isEditing,
  onShare,
  onDownloadBusinessPDF,
  onDownloadCVPDF,
  onSave,
  onApplyChanges,
  setIsEditing,
}: VCardActionsProps) {
  const { selectedStyle } = useVCardStyle();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex flex-wrap gap-3 pt-4 border-t",
        isEditing ? "bg-background/80 p-4 rounded-lg border border-border" : ""
      )}
    >
      {isEditing ? (
        <>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[100px]"
          >
            <Button 
              onClick={onSave}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Sauvegarder
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[100px]"
          >
            <Button 
              onClick={onApplyChanges}
              variant="outline" 
              className="w-full border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              Appliquer
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button 
              onClick={() => setIsEditing(false)}
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              Annuler
            </Button>
          </motion.div>
        </>
      ) : (
        <>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[100px]"
          >
            <Button 
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="w-full border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <Edit className="mr-2 h-4 w-4" />
              Éditer
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[100px]"
          >
            <Button 
              onClick={onShare}
              variant="outline"
              className="w-full border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Partager
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[100px]"
          >
            <Button 
              onClick={onDownloadBusinessPDF}
              variant="outline"
              className="w-full border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <FileText className="mr-2 h-4 w-4" />
              Business PDF
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[100px]"
          >
            <Button 
              onClick={onDownloadCVPDF}
              variant="outline"
              className="w-full border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <FileText className="mr-2 h-4 w-4" />
              CV PDF
            </Button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}