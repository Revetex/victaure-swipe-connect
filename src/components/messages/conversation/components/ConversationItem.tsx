
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserProfile } from "@/types/profile";

export interface ConversationItemProps {
  conversation: {
    id: string;
    participant1: Pick<UserProfile, 'id' | 'full_name' | 'avatar_url'>;
    participant2: Pick<UserProfile, 'id' | 'full_name' | 'avatar_url'>;
    participant1_id: string;
    participant2_id: string;
    last_message?: string;
    last_message_time?: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-4 hover:bg-muted transition-colors",
        isSelected && "bg-primary/10"
      )}
      title={`Conversation avec ${conversation.participant2?.full_name}`}
      aria-label={`Conversation avec ${conversation.participant2?.full_name}`}
      aria-selected={isSelected}
      role="option"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={conversation.participant2?.avatar_url || ''} alt={conversation.participant2?.full_name || ''} />
        <AvatarFallback>{conversation.participant2?.full_name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{conversation.participant2?.full_name}</h4>
        {conversation.last_message && (
          <p className="text-sm text-muted-foreground truncate">
            {conversation.last_message}
          </p>
        )}
      </div>
    </button>
  );
}
