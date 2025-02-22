
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export interface ConversationItemProps {
  conversation: any;
  isSelected: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  const { user } = useAuth();

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors ${
        isSelected ? "bg-muted" : ""
      }`}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={conversation.avatar_url || ""} />
        <AvatarFallback>
          {conversation.full_name?.charAt(0) || "?"}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0 text-left">
        <p className="font-medium truncate">
          {conversation.full_name || "Utilisateur"}
        </p>
        {conversation.last_message && (
          <p className="text-sm text-muted-foreground truncate">
            {conversation.last_message.sender_id === user?.id ? "Vous: " : ""}
            {conversation.last_message.content}
          </p>
        )}
      </div>

      {conversation.last_message && (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {format(new Date(conversation.last_message.created_at), "HH:mm", { locale: fr })}
        </span>
      )}
    </button>
  );
}
