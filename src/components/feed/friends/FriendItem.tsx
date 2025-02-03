import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleDot, MessageCircle } from "lucide-react";
import { FriendPreview } from "@/types/profile";

interface FriendItemProps {
  friend: FriendPreview;
  onMessage: (friendId: string) => void;
  onViewProfile: (friend: FriendPreview) => void;
}

export function FriendItem({ friend, onMessage, onViewProfile }: FriendItemProps) {
  return (
    <div 
      className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors group relative cursor-pointer"
      onClick={() => onViewProfile(friend)}
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
  );
}