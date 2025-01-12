import { Button } from "@/components/ui/button";
import { Share2, FileText, Edit, Save, X, Check } from "lucide-react";
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
        "flex flex-wrap gap-3 pt-4",
        isEditing ? "sticky bottom-0 bg-background/95 backdrop-blur-sm p-4 rounded-lg border shadow-lg z-50" : "border-t"
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
              className="w-full bg-green-500 hover:bg-green-600 text-white group transition-all duration-300"
            >
              <Save className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
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
              className="w-full border-green-500 text-green-500 hover:bg-green-50 group"
            >
              <Check className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
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
              className="border-red-500 text-red-500 hover:bg-red-50 group"
            >
              <X className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
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
              className="w-full border-blue-500 text-blue-500 hover:bg-blue-50 group"
            >
              <Edit className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
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
              className="w-full border-blue-500 text-blue-500 hover:bg-blue-50 group"
            >
              <Share2 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
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
              className="w-full border-blue-500 text-blue-500 hover:bg-blue-50 group"
            >
              <FileText className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
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
              className="w-full border-blue-500 text-blue-500 hover:bg-blue-50 group"
            >
              <FileText className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              CV PDF
            </Button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}