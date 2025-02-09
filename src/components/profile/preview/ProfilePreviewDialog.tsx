
import { UserProfile } from "@/types/profile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, ExternalLink } from "lucide-react";
import { ProfilePreviewCard } from "./ProfilePreviewCard";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useReceiver } from "@/hooks/useReceiver";

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
  const { setReceiver, setShowConversation } = useReceiver();

  const handleChat = () => {
    setReceiver({
      id: profile.id,
      full_name: profile.full_name || '',
      avatar_url: profile.avatar_url || '',
      online_status: profile.online_status || false,
      last_seen: profile.last_seen || new Date().toISOString()
    });
    setShowConversation(true);
    onClose();
  };

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
              onRequestChat={handleChat}
              onClose={onClose}
            />
            
            <div className="mt-4 flex flex-col gap-2">
              <Button 
                onClick={handleChat}
                className="w-full flex items-center gap-2"
                variant="default"
              >
                <MessageCircle className="h-4 w-4" />
                Envoyer un message
              </Button>
              
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
