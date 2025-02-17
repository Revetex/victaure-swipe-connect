
import React from 'react';
import { Message } from '@/types/messages';
import { UserAvatar } from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onReply?: (content: string) => void;
  onJobAccept?: (jobId: string) => Promise<void>;
  onJobReject?: (jobId: string) => void;
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
  // Ajout de réponses rapides pour plus de cas
  if (messageContent.toLowerCase().includes('salaire') || messageContent.toLowerCase().includes('paie')) {
    return [
      "Quel est le salaire moyen?",
      "Négocier mon salaire",
      "Comparer les salaires",
      "Avantages sociaux"
    ];
  }
  return [];
}

export function ChatMessage({ message, onReply, onJobAccept, onJobReject }: ChatMessageProps) {
  const quickReplies = getQuickReplies(message.content);
  const suggestedJobs = message.metadata?.suggestedJobs as any[] || [];

  const handleReply = (reply: string) => {
    if (onReply) {
      onReply(reply);
    }
  };

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

        {message.is_assistant && suggestedJobs && suggestedJobs.length > 0 && onJobAccept && onJobReject && (
          <div className="space-y-2 mt-2 w-full">
            {suggestedJobs.map((job: any) => (
              <div key={job.id} className="bg-muted p-3 rounded-lg">
                <h4 className="font-medium">{job.title}</h4>
                <p className="text-sm text-muted-foreground">{job.company}</p>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onJobReject(job.id)}
                  >
                    Pas intéressé
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onJobAccept(job.id)}
                  >
                    Intéressé
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {message.is_assistant && quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {quickReplies.map((reply) => (
              <Button
                key={reply}
                variant="outline"
                size="sm"
                onClick={() => handleReply(reply)}
                className="bg-background/80 backdrop-blur-sm hover:bg-primary/10 text-sm"
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
