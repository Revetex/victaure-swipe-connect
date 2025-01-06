import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Save, FileText, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { StyleOption } from "./types";
import { UserProfile } from "@/types/profile";

interface VCardActionsProps {
  isEditing: boolean;
  isPdfGenerating: boolean;
  profile: UserProfile;
  selectedStyle: StyleOption;
  onEditToggle: () => void;
  onSave: () => void;
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
  onDownloadBusinessCard,
  onDownloadCV,
}: VCardActionsProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.full_name || '',
          text: `Profil professionnel de ${profile.full_name || ''}`,
          url: window.location.href,
        });
        toast.success("Profil partagé avec succès");
      } catch (error) {
        console.error('Error sharing:', error);
        toast.error("Impossible de partager le profil");
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Lien copié dans le presse-papier");
  };

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
              onClick={handleShare}
              className="w-full bg-white hover:bg-white/90 text-indigo-600 transition-colors"
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
              onClick={onEditToggle}
              variant="outline"
              className="w-full border-white/20 hover:bg-white/10 text-white transition-colors"
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
              onClick={onDownloadBusinessCard}
              variant="outline"
              className="w-full border-white/20 hover:bg-white/10 text-white transition-colors"
              disabled={isPdfGenerating}
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
              onClick={onDownloadCV}
              variant="outline"
              className="w-full border-white/20 hover:bg-white/10 text-white transition-colors"
              disabled={isPdfGenerating}
            >
              <FileText className="mr-2 h-4 w-4" />
              CV PDF
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button 
              onClick={handleCopyLink}
              variant="outline"
              className="border-white/20 hover:bg-white/10 text-white transition-colors"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}