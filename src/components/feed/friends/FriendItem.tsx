
import { useState } from "react";
import { Friend, UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { UserCircle, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ProfilePreviewDialog } from "@/components/profile/preview/ProfilePreviewDialog";
import { useNavigate } from "react-router-dom";
import { useReceiver } from "@/hooks/useReceiver";
import { toast } from "sonner";

interface FriendItemProps {
  friend: Friend;
}

export function FriendItem({ friend }: FriendItemProps) {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const { setReceiver, setShowConversation } = useReceiver();

  const handleStartChat = () => {
    setReceiver({
      id: friend.id,
      full_name: friend.full_name || "",
      avatar_url: friend.avatar_url,
      email: null,
      role: "professional",
      bio: null,
      phone: null,
      city: null,
      state: null,
      country: null,
      skills: [],
      latitude: null,
      longitude: null,
      online_status: friend.online_status ? "online" : "offline",
      last_seen: friend.last_seen,
      certifications: [],
      education: [],
      experiences: [],
      friends: []
    });
    setShowConversation(true);
    navigate("/messages");
    toast.success(`Conversation démarrée avec ${friend.full_name}`);
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
            alt={friend.full_name || ""}
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

      <Button
        variant="ghost"
        size="sm"
        onClick={handleStartChat}
        className="flex items-center gap-2"
      >
        <MessageCircle className="h-4 w-4" />
        Message
      </Button>

      <ProfilePreviewDialog
        profile={{
          ...friend,
          role: "professional",
          email: "",
          bio: null,
          phone: null,
          city: null,
          state: null,
          country: "Canada",
          skills: [],
          latitude: null,
          longitude: null,
          certifications: [],
          education: [],
          experiences: [],
          friends: []
        }}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        onRequestChat={handleStartChat}
      />
    </motion.div>
  );
}
