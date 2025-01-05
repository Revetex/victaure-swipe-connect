import { Button } from "@/components/ui/button";
import { Download, Share2, QrCode, Save, Edit, FileText } from "lucide-react";
import { generateVCard } from "@/utils/pdf/vcard";
import { UserProfile } from "@/types/profile";
import { StyleOption } from "./types";
import { motion } from "framer-motion";

interface VCardActionsProps {
  isEditing: boolean;
  isPdfGenerating: boolean;
  profile: UserProfile;
  selectedStyle: StyleOption;
  onEditToggle: () => void;
  onSave: () => Promise<void>;
  onDownloadVCard: () => Promise<void>;
  onDownloadBusinessCard: () => Promise<void>;
  onDownloadCV: () => Promise<void>;
}

export function VCardActions({
  isEditing,
  isPdfGenerating,
  profile,
  selectedStyle,
  onEditToggle,
  onSave,
  onDownloadVCard,
  onDownloadBusinessCard,
  onDownloadCV
}: VCardActionsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-wrap gap-3 pt-4 border-t border-white/20"
    >
      {isEditing ? (
        <>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[120px]"
          >
            <Button 
              onClick={onSave}
              className="w-full bg-white hover:bg-white/90 text-indigo-600 transition-colors"
              disabled={isPdfGenerating}
            >
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder
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
              onClick={onEditToggle}
              variant="outline"
              className="w-full border-white/20 hover:bg-white/10 text-white transition-colors"
              disabled={isPdfGenerating}
            >
              <Edit className="mr-2 h-4 w-4" />
              Mode édition
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[100px]"
          >
            <Button 
              onClick={onDownloadVCard}
              variant="outline"
              className="w-full border-white/20 hover:bg-white/10 text-white transition-colors"
              disabled={isPdfGenerating}
            >
              <Download className="mr-2 h-4 w-4" />
              VCard
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[100px]"
          >
            <Button 
              onClick={onDownloadBusinessCard}
              variant="outline"
              className="w-full border-white/20 hover:bg-white/10 text-white transition-colors"
              disabled={isPdfGenerating}
            >
              <FileText className="mr-2 h-4 w-4" />
              Business Card
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[100px]"
          >
            <Button 
              onClick={onDownloadCV}
              variant="outline"
              className="w-full border-white/20 hover:bg-white/10 text-white transition-colors"
              disabled={isPdfGenerating}
            >
              <FileText className="mr-2 h-4 w-4" />
              CV
            </Button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}