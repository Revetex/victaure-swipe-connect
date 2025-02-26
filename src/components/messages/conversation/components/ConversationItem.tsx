
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserProfile } from "@/types/profile";

export interface ConversationItemProps {
  conversation: {
    id: string;
    participant1: Pick<UserProfile, 'id' | 'full_name' | 'avatar_url' | 'online_status' | 'last_seen'>;
    participant2: Pick<UserProfile, 'id' | 'full_name' | 'avatar_url' | 'online_status' | 'last_seen'>;
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
        "w-full flex items-center gap-3 p-4",
        "transition-colors duration-200",
        "hover:bg-[#3C3C3C]/20",
        isSelected ? "bg-[#64B5D9]/10" : "bg-transparent"
      )}
      title={`Conversation avec ${conversation.participant2?.full_name}`}
      aria-label={`Conversation avec ${conversation.participant2?.full_name}`}
      aria-selected={isSelected}
      role="option"
    >
      <Avatar className="h-10 w-10 border border-[#3C3C3C]/20">
        <AvatarImage src={conversation.participant2?.avatar_url || ''} alt={conversation.participant2?.full_name || ''} />
        <AvatarFallback className="bg-[#2C2C2C]">{conversation.participant2?.full_name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-[#E0E0E0] truncate">{conversation.participant2?.full_name}</h4>
        {conversation.last_message && (
          <p className="text-sm text-[#808080] truncate">
            {conversation.last_message}
          </p>
        )}
      </div>
    </button>
  );
}
