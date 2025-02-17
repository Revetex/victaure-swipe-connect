
import React from 'react';
import { Message } from '@/types/messages';
import { UserAvatar } from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onReply?: (content: string) => void;
}

function getQuickReplies(messageContent: string): string[] {
  if (messageContent.toLowerCase().includes('emploi') || messageContent.toLowerCase().includes('job')) {
    return [
      "Montrez-moi les offres récentes",
      "Je cherche dans un autre domaine",
      "Aidez-moi avec mon CV",
      "Quelles sont les entreprises qui recrutent?"
    ];
  }
  if (messageContent.toLowerCase().includes('cv') || messageContent.toLowerCase().includes('curriculum')) {
    return [
      "Comment améliorer mon CV?",
      "Vérifiez mon CV",
      "Créer un nouveau CV",
      "Exemples de CV"
    ];
  }
  return [];
}

export function ChatMessage({ message, onReply }: ChatMessageProps) {
  const quickReplies = getQuickReplies(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${message.is_assistant ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <UserAvatar
        user={{
          id: message.is_assistant ? message.sender.id : message.receiver.id,
          full_name: message.is_assistant ? message.sender.full_name : message.receiver.full_name,
          avatar_url: message.is_assistant ? message.sender.avatar_url : message.receiver.avatar_url,
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
          online_status: message.is_assistant ? message.sender.online_status : message.receiver.online_status,
          last_seen: message.is_assistant ? message.sender.last_seen : message.receiver.last_seen,
          certifications: [],
          education: [],
          experiences: [],
          friends: []
        }}
        className="h-8 w-8 mt-1"
      />
      
      <div className={`flex flex-col space-y-2 ${message.is_assistant ? 'items-start' : 'items-end'} max-w-[80%]`}>
        <div className={`px-4 py-2 rounded-lg ${
          message.is_assistant 
            ? 'bg-muted text-foreground' 
            : 'bg-primary text-primary-foreground'
        }`}>
          {message.thinking ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>En train de réfléchir...</span>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {message.is_assistant && quickReplies.length > 0 && onReply && (
          <div className="flex flex-wrap gap-2 mt-2">
            {quickReplies.map((reply) => (
              <Button
                key={reply}
                variant="outline"
                size="sm"
                onClick={() => onReply(reply)}
                className="bg-background/80 backdrop-blur-sm hover:bg-primary/10"
              >
                {reply}
              </Button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
