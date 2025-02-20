
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";
import { Trash2 } from "lucide-react";
import { UserProfile } from "@/types/profile";

interface ConversationItemProps {
  participant: UserProfile;
  lastMessage: string;
  lastMessageTime: string;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export function ConversationItem({
  participant,
  lastMessage,
  lastMessageTime,
  onSelect,
  onDelete
}: ConversationItemProps) {
  return (
    <button
      className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors relative group"
      onClick={onSelect}
    >
      <UserAvatar
        user={participant}
        className="h-12 w-12"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <p className="font-medium truncate">
            {participant.full_name}
          </p>
          <span className="text-xs text-muted-foreground">
            {new Date(lastMessageTime).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {lastMessage}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </button>
  );
}
