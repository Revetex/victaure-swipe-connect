import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleDot, MessageCircle } from "lucide-react";
import { FriendPreview } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";
import { useState } from "react";

interface FriendItemProps {
  friend: FriendPreview;
  onMessage: (friendId: string) => void;
}

export function FriendItem({ friend, onMessage }: FriendItemProps) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <div 
        className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors group relative cursor-pointer"
        onClick={() => setShowProfile(true)}
      >
        <Avatar className="h-10 w-10 border-2 border-primary/10">
          <AvatarImage src={friend.avatar_url || ''} alt={friend.full_name || ''} />
          <AvatarFallback>
            {friend.full_name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{friend.full_name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <CircleDot className={`h-2 w-2 ${friend.online_status ? "text-green-500" : "text-gray-300"}`} />
            {friend.online_status ? "En ligne" : "Hors ligne"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onMessage(friend.id);
          }}
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
      </div>

      {showProfile && (
        <ProfilePreview
          profile={{
            id: friend.id,
            full_name: friend.full_name,
            avatar_url: friend.avatar_url,
            email: '',
            role: 'professional',
            bio: null,
            phone: null,
            city: null,
            state: null,
            country: 'Canada',
            skills: [],
            latitude: null,
            longitude: null
          }}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
}