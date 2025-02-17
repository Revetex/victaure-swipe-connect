
import { useState } from "react";
import { Friend, UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ProfilePreviewDialog } from "@/components/profile/preview/ProfilePreviewDialog";
import { createEmptyProfile } from "@/types/profile";

interface FriendItemProps {
  friend: Friend;
  onRequestChat?: () => void;
}

export function FriendItem({ friend, onRequestChat }: FriendItemProps) {
  const [showProfile, setShowProfile] = useState(false);

  // Créer un profil complet à partir des données de l'ami
  const friendProfile: UserProfile = {
    ...createEmptyProfile(friend.id, ''),
    id: friend.id,
    full_name: friend.full_name,
    avatar_url: friend.avatar_url || null,
    online_status: friend.online_status || false,
    last_seen: friend.last_seen || new Date().toISOString()
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <button
        onClick={() => setShowProfile(true)}
        className="relative flex-shrink-0"
      >
        {friend.avatar_url ? (
          <img
            src={friend.avatar_url}
            alt={friend.full_name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <UserCircle className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
        {friend.online_status && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">
          {friend.full_name}
        </h3>
      </div>

      {onRequestChat && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRequestChat}
        >
          Message
        </Button>
      )}

      <ProfilePreviewDialog
        profile={friendProfile}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        onRequestChat={onRequestChat}
      />
    </motion.div>
  );
}
