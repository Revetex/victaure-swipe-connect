
import { cn } from "@/lib/utils";
import { Message } from "@/types/messages";
import { UserAvatar } from "@/components/UserAvatar";
import { Card } from "@/components/ui/card";

interface ChatMessageProps {
  message: Message;
  showAvatar?: boolean;
}

export function ChatMessage({ message, showAvatar = true }: ChatMessageProps) {
  const isSentByMe = message.sender_id === 'me';
  const messageUser = message.sender;

  return (
    <div className={cn(
      "flex items-end gap-2",
      isSentByMe ? "flex-row-reverse" : "flex-row"
    )}>
      {showAvatar ? (
        <UserAvatar
          user={messageUser}
          className="h-8 w-8 flex-shrink-0"
        />
      ) : (
        <div className="w-8 flex-shrink-0" />
      )}
      
      <div className={cn(
        "flex flex-col space-y-1 max-w-[70%]",
        isSentByMe ? "items-end" : "items-start"
      )}>
        {showAvatar && (
          <span className="text-xs text-muted-foreground px-2">
            {messageUser.full_name}
          </span>
        )}
        
        <Card className={cn(
          "px-4 py-2",
          isSentByMe 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-muted rounded-tl-none",
          !showAvatar && "rounded-t-xl"
        )}>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </Card>
      </div>
    </div>
  );
}
