import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { FileText, UserPlus, UserMinus, Ban, Download, MessageCircle } from "lucide-react";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import { useConnectionActions } from "./hooks/useConnectionActions";
import { ProfilePreviewHeader } from "./ProfilePreviewHeader";
import { ProfilePreviewBio } from "./ProfilePreviewBio";
import { ProfilePreviewSkills } from "./ProfilePreviewSkills";
import { ProfilePreviewContact } from "./ProfilePreviewContact";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProfilePreviewFrontProps {
  profile: UserProfile;
  onRequestChat?: () => void;
  onFlip: () => void;
}

export function ProfilePreviewFront({
  profile,
  onRequestChat,
  onFlip,
}: ProfilePreviewFrontProps) {
  const {
    isFriend,
    isBlocked,
    isFriendRequestSent,
    isFriendRequestReceived,
  } = useConnectionStatus(profile.id);

  const {
    handleAddFriend,
    handleAcceptFriend,
    handleRemoveFriend,
    handleToggleBlock,
    handleRequestCV,
  } = useConnectionActions(profile.id);

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
      >
        <div className="p-6">
          <ProfilePreviewHeader profile={profile} onRequestChat={onRequestChat} />
          
          {isFriend && (
            <>
              <ProfilePreviewBio profile={profile} />
              <ProfilePreviewSkills profile={profile} />
              <ProfilePreviewContact profile={profile} />
            </>
          )}
        </div>
      </motion.div>

      <div className="flex flex-col gap-3 mt-6">
        <div className="grid grid-cols-2 gap-3">
          {isFriend ? (
            <>
              <Button
                variant="default"
                className="bg-primary/10 hover:bg-primary/20 text-primary flex items-center gap-2"
                onClick={() => window.location.href = `/profile/${profile.id}`}
              >
                <FileText className="w-4 h-4" />
                Voir profil complet
              </Button>
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                onClick={handleRemoveFriend}
              >
                <UserMinus className="w-4 h-4" />
                Supprimer
              </Button>
            </>
          ) : isFriendRequestReceived ? (
            <Button
              variant="default"
              className="flex items-center gap-2 col-span-2"
              onClick={handleAcceptFriend}
            >
              <UserPlus className="w-4 h-4" />
              Accepter la demande
            </Button>
          ) : !isFriendRequestSent ? (
            <Button
              variant="default"
              className="flex items-center gap-2 col-span-2"
              onClick={handleAddFriend}
            >
              <UserPlus className="w-4 h-4" />
              Se connecter
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="flex items-center gap-2 col-span-2"
              disabled
            >
              Demande envoyée
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={isBlocked ? "destructive" : "outline"}
            onClick={handleToggleBlock}
            className="flex items-center gap-2"
          >
            <Ban className="w-4 h-4" />
            {isBlocked ? "Débloquer" : "Bloquer"}
          </Button>

          {isFriend && onRequestChat && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={onRequestChat}
            >
              <MessageCircle className="w-4 h-4" />
              Message
            </Button>
          )}

          {isFriend && (
            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-2",
                !onRequestChat && "col-span-2"
              )}
              onClick={handleRequestCV}
            >
              <Download className="w-4 h-4" />
              Demander CV
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          className="w-full mt-2"
          onClick={onFlip}
        >
          Voir le dos de la carte
        </Button>
      </div>
    </div>
  );
}