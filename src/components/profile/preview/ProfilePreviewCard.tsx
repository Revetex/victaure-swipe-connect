
import { UserProfile } from "@/types/profile";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Mail, Globe, UserPlus, UserMinus, UserX } from "lucide-react";
import { motion } from "framer-motion";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import { useConnectionActions } from "./hooks/useConnectionActions";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface ProfilePreviewCardProps {
  profile: UserProfile;
  onRequestChat?: () => void;
  onClose: () => void;
}

export function ProfilePreviewCard({
  profile,
  onRequestChat,
  onClose,
}: ProfilePreviewCardProps) {
  const { user } = useAuth();
  const isOwnProfile = user?.id === profile.id;

  const {
    isFriend,
    isBlocked,
    isFriendRequestSent,
    isFriendRequestReceived
  } = useConnectionStatus(profile.id);

  const {
    handleAddFriend,
    handleAcceptFriend,
    handleRemoveFriend,
    handleToggleBlock,
  } = useConnectionActions(profile.id);

  const handleActionWithToast = async (action: () => Promise<void>, successMessage: string) => {
    try {
      await action();
      toast.success(successMessage);
    } catch (error) {
      console.error("Action error:", error);
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="w-20 h-20 border-2 border-primary/10">
            <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
            <AvatarFallback>
              {profile.full_name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {profile.full_name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {profile.role}
            </p>
          </div>

          {profile.company_name && (
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {profile.company_name}
            </p>
          )}

          {!isOwnProfile && (
            <div className="w-full space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
              {!isFriend && !isFriendRequestSent && !isFriendRequestReceived && !isBlocked && (
                <Button 
                  variant="default" 
                  className="w-full flex items-center gap-2"
                  onClick={() => handleActionWithToast(handleAddFriend, "Demande d'ami envoyée")}
                >
                  <UserPlus className="h-4 w-4" />
                  Ajouter en ami
                </Button>
              )}

              {isFriendRequestReceived && (
                <Button
                  variant="default"
                  className="w-full flex items-center gap-2"
                  onClick={() => handleActionWithToast(handleAcceptFriend, "Demande d'ami acceptée")}
                >
                  <UserPlus className="h-4 w-4" />
                  Accepter la demande
                </Button>
              )}

              {(isFriend || isFriendRequestSent) && (
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 text-destructive hover:text-destructive"
                  onClick={() => handleActionWithToast(handleRemoveFriend, 
                    isFriend ? "Ami retiré" : "Demande annulée")}
                >
                  <UserMinus className="h-4 w-4" />
                  {isFriend ? "Retirer des amis" : "Annuler la demande"}
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => handleActionWithToast(handleToggleBlock, 
                  isBlocked ? "Utilisateur débloqué" : "Utilisateur bloqué")}
              >
                <UserX className="h-4 w-4" />
                {isBlocked ? "Débloquer" : "Bloquer"}
              </Button>
            </div>
          )}

          <div className="w-full pt-4 grid grid-cols-2 gap-3">
            {profile.email && (
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2 bg-transparent"
                onClick={() => window.location.href = `mailto:${profile.email}`}
              >
                <Mail className="w-4 h-4" />
                Email
              </Button>
            )}
            
            {profile.phone && (
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 bg-transparent"
                onClick={() => window.location.href = `tel:${profile.phone}`}
              >
                <Phone className="w-4 h-4" />
                Téléphone
              </Button>
            )}

            {profile.website && (
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 bg-transparent"
                onClick={() => window.open(profile.website, '_blank')}
              >
                <Globe className="w-4 h-4" />
                Site Web
              </Button>
            )}

            {onRequestChat && isFriend && !isBlocked && (
              <Button
                className="w-full flex items-center gap-2 bg-primary hover:bg-primary/90"
                onClick={onRequestChat}
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
