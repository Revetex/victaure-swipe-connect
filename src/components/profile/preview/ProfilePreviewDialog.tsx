
import { UserProfile } from "@/types/profile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Undo2, MessageCircle, ExternalLink } from "lucide-react";
import { ProfilePreviewCard } from "./ProfilePreviewCard";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface ProfilePreviewDialogProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onRequestChat?: () => void;
}

export function ProfilePreviewDialog({
  profile,
  isOpen,
  onClose,
  onRequestChat,
}: ProfilePreviewDialogProps) {
  const navigate = useNavigate();

  const handleViewFullProfile = () => {
    navigate(`/profile/${profile.id}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 overflow-hidden bg-transparent border-none shadow-xl">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <ProfilePreviewCard
              profile={profile}
              onRequestChat={onRequestChat}
              onClose={onClose}
            />
            
            <div className="mt-4 flex flex-col gap-2">
              {onRequestChat && (
                <Button 
                  onClick={onRequestChat}
                  className="w-full flex items-center gap-2"
                  variant="default"
                >
                  <MessageCircle className="h-4 w-4" />
                  Envoyer un message
                </Button>
              )}
              
              <Button 
                onClick={handleViewFullProfile}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <ExternalLink className="h-4 w-4" />
                Voir le profil complet
              </Button>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
