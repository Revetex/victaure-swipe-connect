
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
}

export function ChatMessage({ message, onReply, onJobAccept, onJobReject }: ChatMessageProps) {
  const suggestedJobs = message.metadata?.suggestedJobs as any[] || [];

  return (
    <MessageAnimation>
      <div className={`flex ${message.sender_id === 'assistant' ? 'flex-row' : 'flex-row-reverse'} w-full`}>
        <UserAvatar
          user={{
            id: message.sender_id === 'assistant' ? message.sender.id : message.receiver.id,
            full_name: message.sender_id === 'assistant' ? message.sender.full_name : message.receiver.full_name,
            avatar_url: message.sender_id === 'assistant' ? message.sender.avatar_url : message.receiver.avatar_url,
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
            online_status: message.sender_id === 'assistant' ? message.sender.online_status : message.receiver.online_status,
            last_seen: message.sender_id === 'assistant' ? message.sender.last_seen : message.receiver.last_seen,
            certifications: [],
            education: [],
            experiences: [],
            friends: []
          }}
          className="h-8 w-8 mt-1"
        />
        
        <div className={`flex flex-col space-y-2 ${message.sender_id === 'assistant' ? 'items-start' : 'items-end'} flex-1`}>
          <div className="flex items-start gap-2 w-full">
            <Card
              className={`px-4 py-2 ${
                message.sender_id === 'assistant' 
                  ? 'bg-muted/50 backdrop-blur-sm border-primary/10' 
                  : 'bg-primary text-primary-foreground'
              } max-w-[80%]`}
            >
              {message.sender_id === 'assistant' ? (
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
            
            {message.sender_id === 'assistant' && !message.thinking && (
              <div className="flex flex-col gap-2">
                <MessageAudioControls text={message.content} />
              </div>
            )}
          </div>
        </div>
      </div>
    </MessageAnimation>
  );
}
