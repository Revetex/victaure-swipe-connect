import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UserProfile } from "@/types/profile";
import { ProfilePreviewHeader } from "./profile/preview/ProfilePreviewHeader";
import { ProfilePreviewBio } from "./profile/preview/ProfilePreviewBio";
import { ProfilePreviewSkills } from "./profile/preview/ProfilePreviewSkills";
import { ProfilePreviewContact } from "./profile/preview/ProfilePreviewContact";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { FileText, UserPlus, UserMinus, Ban, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProfilePreviewProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onRequestChat?: () => void;
}

export function ProfilePreview({
  profile,
  isOpen,
  onClose,
  onRequestChat,
}: ProfilePreviewProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);

  const handleAddFriend = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user.id,
          receiver_id: profile.id,
          status: 'pending'
        });

      if (error) throw error;
      setIsFriendRequestSent(true);
      toast.success("Demande d'ami envoyée");
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error("Erreur lors de l'envoi de la demande");
    }
  };

  const handleRemoveFriend = async () => {
    // Implement friend removal logic
    setIsFriend(false);
    toast.success("Ami supprimé");
  };

  const handleToggleBlock = async () => {
    setIsBlocked(!isBlocked);
    toast.success(isBlocked ? "Utilisateur débloqué" : "Utilisateur bloqué");
  };

  const handleRequestCV = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("notifications").insert({
        user_id: profile.id,
        title: "Demande de CV",
        message: `${user.email} aimerait consulter votre CV`,
      });

      toast.success("Demande de CV envoyée");
    } catch (error) {
      console.error('Error requesting CV:', error);
      toast.error("Erreur lors de l'envoi de la demande");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[425px] gap-4 overflow-y-auto max-h-[90vh] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
        style={{ 
          position: 'fixed',
          zIndex: 9999,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          perspective: '1000px'
        }}
      >
        <DialogTitle className="sr-only">Profile Preview</DialogTitle>
        
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, rotateY: isFlipped ? -180 : 0 }}
            animate={{ opacity: 1, rotateY: isFlipped ? 180 : 0 }}
            exit={{ opacity: 0, rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative"
          >
            {!isFlipped ? (
              // Front of the card
              <div className="space-y-6">
                <ProfilePreviewHeader 
                  profile={profile}
                  onRequestChat={onRequestChat}
                />
                
                <ProfilePreviewBio profile={profile} />
                <ProfilePreviewSkills profile={profile} />
                <ProfilePreviewContact profile={profile} />

                <div className="flex flex-wrap gap-2 mt-4">
                  {isFriend ? (
                    <>
                      <Button
                        variant="default"
                        className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary"
                        onClick={() => window.location.href = `/profile/${profile.id}`}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Voir profil complet
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={handleRemoveFriend}
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Supprimer
                      </Button>
                    </>
                  ) : !isFriendRequestSent ? (
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={handleAddFriend}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Ajouter en ami
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      className="flex-1"
                      disabled
                    >
                      Demande envoyée
                    </Button>
                  )}

                  <Button
                    variant={isBlocked ? "destructive" : "outline"}
                    onClick={handleToggleBlock}
                    className="flex-1"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    {isBlocked ? "Débloquer" : "Bloquer"}
                  </Button>

                  {isFriend && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleRequestCV}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Demander CV
                    </Button>
                  )}
                </div>

                <Button
                  variant="ghost"
                  className="w-full mt-2"
                  onClick={() => setIsFlipped(true)}
                >
                  Voir le dos de la carte
                </Button>
              </div>
            ) : (
              // Back of the card
              <div className="space-y-6 p-6 bg-gradient-to-br from-[#1A1F2C] to-[#403E43] text-white rounded-lg shadow-xl">
                <div className="text-center space-y-4">
                  <img
                    src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png"
                    alt="Logo"
                    className="w-24 h-24 mx-auto opacity-20"
                  />
                  <div className="text-sm text-gray-300">
                    <p>Membre depuis {new Date(profile.created_at || '').toLocaleDateString()}</p>
                    <p>{profile.role === 'professional' ? 'Professionnel' : 'Employeur'}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full mt-2 text-white hover:text-white/80 hover:bg-white/10"
                  onClick={() => setIsFlipped(false)}
                >
                  Retourner la carte
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}