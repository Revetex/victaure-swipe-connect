
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConversationItemProps {
  conversation: any;
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
      title={`Conversation avec ${conversation.title}`}
      aria-label={`Conversation avec ${conversation.title}`}
      aria-selected={isSelected}
      role="option"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={conversation.avatar_url} alt={conversation.title} />
        <AvatarFallback>{conversation.title?.[0]?.toUpperCase() || '?'}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{conversation.title}</h4>
        {conversation.lastMessage && (
          <p className="text-sm text-muted-foreground truncate">
            {conversation.lastMessage}
          </p>
        )}
      </div>
    </button>
  );
}
