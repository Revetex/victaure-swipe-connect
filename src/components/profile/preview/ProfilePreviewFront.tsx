import { useState, useEffect } from "react";
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { FileText, UserPlus, UserMinus, Ban, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import { useConnectionActions } from "./hooks/useConnectionActions";

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
        ) : isFriendRequestReceived ? (
          <Button
            variant="default"
            className="flex-1"
            onClick={handleAcceptFriend}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Accepter la demande
          </Button>
        ) : !isFriendRequestSent ? (
          <Button
            variant="default"
            className="flex-1"
            onClick={handleAddFriend}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Se connecter
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
        onClick={onFlip}
      >
        Voir le dos de la carte
      </Button>
    </div>
  );
}