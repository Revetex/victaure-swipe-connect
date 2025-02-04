import { Message } from "@/types/messages";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserMessageProps {
  message: Message;
  onSelect?: () => void;
}

export function UserMessage({ message, onSelect }: UserMessageProps) {
  return (
    <div 
      onClick={onSelect}
      className={cn(
        "p-4 rounded-lg cursor-pointer transition-all duration-200",
        "hover:scale-[1.02] hover:bg-muted/80",
        !message.read 
          ? "bg-primary/10 border-l-2 border-primary shadow-sm" 
          : "bg-muted"
      )}
    >
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={message.sender.avatar_url} alt={message.sender.full_name} />
          <AvatarFallback>
            {message.sender.full_name?.slice(0, 2).toUpperCase() || "??"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-medium truncate text-foreground">
              {message.sender.full_name}
            </h3>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {format(new Date(message.created_at), "HH:mm", { locale: fr })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}