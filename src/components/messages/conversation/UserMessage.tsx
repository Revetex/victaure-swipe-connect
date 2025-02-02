import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface UserMessageProps {
  message: any;
}

export function UserMessage({ message }: UserMessageProps) {
  const timestamp = message.created_at ? formatDistanceToNow(new Date(message.created_at), { 
    addSuffix: true,
    locale: fr 
  }) : '';

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
      <Avatar className="h-12 w-12">
        <AvatarImage src={message.sender?.avatar_url} />
        <AvatarFallback>
          {message.sender?.full_name?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold truncate">
            {message.sender?.full_name || "Utilisateur"}
          </h3>
          <span className="text-sm text-muted-foreground">{timestamp}</span>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {message.content}
        </p>
      </div>
    </div>
  );
}