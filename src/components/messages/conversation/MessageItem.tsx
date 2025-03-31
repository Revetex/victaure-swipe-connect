
import React from "react";
import { cn } from "@/lib/utils";
import { Message } from "@/types/messages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, CheckCheck } from "lucide-react";

interface MessageItemProps {
  message: Message;
  isOutgoing: boolean;
}

export function MessageItem({ message, isOutgoing }: MessageItemProps) {
  // Format timestamp
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const timestamp = message.created_at ? formatTimestamp(message.created_at) : '';
  
  // Handle sender data, which might be an error if the join failed
  const senderName = message.sender 
    ? (typeof message.sender === 'string' 
      ? 'Unknown' 
      : (message.sender.full_name || 'Unknown')) 
    : 'Unknown';

  const senderAvatar = message.sender && typeof message.sender !== 'string' 
    ? message.sender.avatar_url 
    : null;

  return (
    <div className={cn(
      "flex mb-4 last:mb-0",
      isOutgoing ? "justify-end" : "justify-start"
    )}>
      {!isOutgoing && (
        <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
          <AvatarImage src={senderAvatar || ""} alt={senderName} />
          <AvatarFallback>
            {senderName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "max-w-[70%]",
        isOutgoing ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-lg px-3 py-2 break-words",
          isOutgoing 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-foreground"
        )}>
          {message.content}
        </div>
        
        <div className={cn(
          "flex items-center text-xs text-muted-foreground mt-1",
          isOutgoing ? "justify-end" : "justify-start"
        )}>
          <span>{timestamp}</span>
          {isOutgoing && (
            <span className="ml-1">
              {message.read === true || message.status === 'read' ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
