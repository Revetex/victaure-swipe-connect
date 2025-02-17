
import React from 'react';
import { Message } from '@/types/messages';
import { UserAvatar } from '@/components/UserAvatar';
import { JobSuggestion } from './JobSuggestion';
import { QuickReplies } from './QuickReplies';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Json } from '@/types/database/auth';

interface ChatMessageProps {
  message: Message;
  onReply?: (content: string) => void;  // Remis en optionnel
  onJobAccept?: (jobId: string) => void;
  onJobReject?: (jobId: string) => void;
}

function getQuickReplies(messageContent: string): string[] {
  if (messageContent.includes('emploi') || messageContent.includes('job')) {
    return [
      "Montrez-moi les offres récentes",
      "Je cherche dans un autre domaine",
      "Aidez-moi avec mon CV",
      "Quelles sont les entreprises qui recrutent?"
    ];
  }
  if (messageContent.includes('cv') || messageContent.includes('curriculum')) {
    return [
      "Comment améliorer mon CV?",
      "Vérifiez mon CV",
      "Créer un nouveau CV",
      "Exemples de CV"
    ];
  }
  return [];
}

function getSuggestedJobs(metadata: Record<string, Json>): any[] {
  const suggestedJobs = metadata?.suggestedJobs;
  if (Array.isArray(suggestedJobs)) {
    return suggestedJobs;
  }
  return [];
}

export function ChatMessage({ message, onReply, onJobAccept, onJobReject }: ChatMessageProps) {
  const quickReplies = getQuickReplies(message.content);
  const suggestedJobs = getSuggestedJobs(message.metadata);
  const isSearching = message.thinking;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${message.is_assistant ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <UserAvatar
        user={message.is_assistant ? {
          id: message.sender.id,
          full_name: message.sender.full_name,
          avatar_url: message.sender.avatar_url,
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
          online_status: message.sender.online_status,
          last_seen: message.sender.last_seen,
          certifications: [],
          education: [],
          experiences: [],
          friends: []
        } : {
          id: message.receiver.id,
          full_name: message.receiver.full_name,
          avatar_url: message.receiver.avatar_url,
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
          online_status: message.receiver.online_status,
          last_seen: message.receiver.last_seen,
          certifications: [],
          education: [],
          experiences: [],
          friends: []
        }}
        className="h-8 w-8 mt-1"
      />
      
      <div className={`flex flex-col space-y-2 ${message.is_assistant ? 'items-start' : 'items-end'}`}>
        <div className={`px-4 py-2 rounded-lg max-w-[80%] ${
          message.is_assistant 
            ? 'bg-muted text-foreground' 
            : 'bg-primary text-primary-foreground'
        }`}>
          {isSearching ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Recherche des offres pertinentes...</span>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {message.is_assistant && suggestedJobs.length > 0 && (
          <div className="w-full space-y-2">
            {suggestedJobs.map((job) => (
              <JobSuggestion
                key={job.id}
                job={job}
                onAccept={onJobAccept!}
                onReject={onJobReject!}
              />
            ))}
          </div>
        )}

        {message.is_assistant && quickReplies.length > 0 && onReply && (
          <QuickReplies
            suggestions={quickReplies}
            onSelect={onReply}
          />
        )}
      </div>
    </motion.div>
  );
}
