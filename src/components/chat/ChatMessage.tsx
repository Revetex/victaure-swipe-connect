
import React from 'react';
import { Message } from '@/types/messages';
import { UserAvatar } from '@/components/UserAvatar';
import { Card } from '@/components/ui/card';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MessageAnimation } from './MessageAnimation';
import { AssistantMessageContent } from './AssistantMessageContent';
import { MessageAudioControls } from './MessageAudioControls';

interface ChatMessageProps {
  message: Message;
  onReply?: (content: string) => void;
  onJobAccept?: (jobId: string) => Promise<void>;
  onJobReject?: (jobId: string) => void;
  showAvatar?: boolean;
}

export function ChatMessage({ 
  message, 
  onReply, 
  onJobAccept, 
  onJobReject,
  showAvatar = true 
}: ChatMessageProps) {
  const suggestedJobs = message.metadata?.suggestedJobs as any[] || [];
  const isAssistant = message.sender_id === 'assistant';
  const isSentByMe = !isAssistant && message.sender_id === 'me';

  const messageUser = isAssistant ? message.sender : message.sender;
  const avatarUser = isAssistant ? message.sender : message.sender;

  return (
    <MessageAnimation>
      <div className={`flex ${isSentByMe ? 'flex-row-reverse' : 'flex-row'} w-full items-end gap-2`}>
        {showAvatar ? (
          <UserAvatar
            user={{
              id: avatarUser.id,
              full_name: avatarUser.full_name,
              avatar_url: avatarUser.avatar_url,
              email: null,
              role: 'professional',
              bio: null,
              phone: null,
              city: null,
              state: null,
              country: 'Canada',
              skills: [],
              latitude: null,
              longitude: null,
              online_status: avatarUser.online_status,
              last_seen: avatarUser.last_seen,
              certifications: [],
              education: [],
              experiences: [],
              friends: []
            }}
            className="h-8 w-8 flex-shrink-0"
          />
        ) : (
          <div className="w-8 flex-shrink-0" />
        )}
        
        <div 
          className={cn(
            "flex flex-col space-y-1 max-w-[70%]",
            isSentByMe ? 'items-end' : 'items-start',
            !showAvatar && (isSentByMe ? 'mr-10' : 'ml-10')
          )}
        >
          {showAvatar && (
            <span className="text-xs text-muted-foreground px-2">
              {messageUser.full_name}
            </span>
          )}
          
          <Card
            className={cn(
              "px-4 py-2",
              isSentByMe 
                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                : isAssistant
                ? 'bg-muted/50 backdrop-blur-sm border-primary/10 rounded-tl-none'
                : 'bg-muted rounded-tl-none',
              !showAvatar && 'rounded-t-xl'
            )}
          >
            {isAssistant ? (
              <AssistantMessageContent 
                message={message}
                suggestedJobs={suggestedJobs}
                onJobAccept={onJobAccept}
                onJobReject={onJobReject}
              />
            ) : (
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
            )}
          </Card>
          
          {isAssistant && !message.thinking && (
            <div className="flex flex-col gap-2">
              <MessageAudioControls text={message.content} />
            </div>
          )}
        </div>
      </div>
    </MessageAnimation>
  );
}
