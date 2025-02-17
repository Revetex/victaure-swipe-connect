
import React from 'react';
import { Message } from '@/types/messages';
import { UserAvatar } from '@/components/UserAvatar';
import { JobSuggestion } from './JobSuggestion';
import { QuickReplies } from './QuickReplies';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onReply?: (content: string) => void;
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

export function ChatMessage({ message, onReply, onJobAccept, onJobReject }: ChatMessageProps) {
  const quickReplies = getQuickReplies(message.content);
  const suggestedJobs = message.metadata?.suggestedJobs || [];
  const isSearching = message.thinking;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${message.is_assistant ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <UserAvatar
        user={message.is_assistant ? message.sender : message.receiver}
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

        {message.is_assistant && quickReplies.length > 0 && (
          <QuickReplies
            suggestions={quickReplies}
            onSelect={onReply!}
          />
        )}
      </div>
    </motion.div>
  );
}
