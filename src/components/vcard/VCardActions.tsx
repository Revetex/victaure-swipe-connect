import { Button } from "@/components/ui/button";
import { Share2, Download, FileText, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { StyleOption } from "./types";
import { UserProfile } from "@/types/profile";
import { generateVCardData } from "@/utils/profileActions";

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
  onEditToggle,
  onSave,
  onDownloadVCard,
  onDownloadBusinessCard,
  onDownloadCV,
}: VCardActionsProps) {
  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${profile.full_name}'s VCard`,
        text: `Découvrez le profil professionnel de ${profile.full_name}`,
        url: window.location.href,
      });
      toast.success("Profil partagé avec succès");
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast.error("Erreur lors du partage");
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
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
              disabled={isPdfGenerating}
            >
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
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
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
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
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
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
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
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
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
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
              disabled={isPdfGenerating}
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