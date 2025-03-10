
import React from 'react';
import { Message } from '@/types/messages';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserAvatar } from '@/components/UserAvatar';

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
  timestamp: string;
}

export function MessageItem({ message, isOwnMessage, timestamp }: MessageItemProps) {
  // Determine message style based on sender
  const messageContainerClass = cn(
    "flex mb-4",
    isOwnMessage ? "justify-end" : "justify-start"
  );

  const messageBubbleClass = cn(
    "max-w-[80%] px-4 py-2 rounded-lg",
    isOwnMessage 
      ? "bg-primary text-primary-foreground rounded-br-none" 
      : "bg-muted text-foreground rounded-bl-none"
  );

  const timeClass = cn(
    "text-xs mt-1",
    isOwnMessage ? "text-right" : "text-left",
    "text-muted-foreground"
  );

  return (
    <div className={messageContainerClass}>
      {!isOwnMessage && (
        <div className="mr-2">
          {message.sender ? (
            <UserAvatar 
              user={{
                id: message.sender.id,
                name: message.sender.full_name || 'Unknown',
                image: message.sender.avatar_url || ''
              }}
              className="h-8 w-8"
            />
          ) : (
            <Avatar className="h-8 w-8">
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
          )}
        </div>
      )}
      
      <div className={isOwnMessage ? "items-end" : "items-start"}>
        <div className={messageBubbleClass}>
          {message.content}
        </div>
        <div className={timeClass}>
          {timestamp}
        </div>
      </div>
      
      {isOwnMessage && message.status && (
        <div className="ml-2 self-end mb-1">
          <span className="text-xs text-muted-foreground">
            {message.status === 'sent' && '✓'}
            {message.status === 'delivered' && '✓✓'}
            {message.status === 'read' && '✓✓'}
            {message.status === 'failed' && '!'}
          </span>
        </div>
      )}
    </div>
  );
}
