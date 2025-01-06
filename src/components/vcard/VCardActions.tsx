import { Button } from "@/components/ui/button";
import { Download, Share2, FileText, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { UserProfile } from "@/types/profile";
import { StyleOption } from "./types";
import { toast } from "sonner";

interface VCardActionsProps {
  isEditing: boolean;
  isPdfGenerating: boolean;
  profile: UserProfile;
  selectedStyle: StyleOption;
  onEditToggle: () => void;
  onSave: () => Promise<void>;
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
  onDownloadCV
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
        if (error.name !== 'AbortError') {
          toast.error("Erreur lors du partage");
        }
      }
    } else {
      // Fallback to copying link
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Lien copié dans le presse-papier");
      } catch (error) {
        toast.error("Impossible de copier le lien");
      }
    }
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
              disabled={isPdfGenerating}
            >
              <Edit className="mr-2 h-4 w-4" />
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
              disabled={isPdfGenerating}
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