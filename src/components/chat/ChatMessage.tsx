import React, { useState, useEffect } from 'react';
import { Message } from '@/types/messages';
import { UserAvatar } from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Loader2, Volume2, VolumeX, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

interface ChatMessageProps {
  message: Message;
  onReply?: (content: string) => void;
  onJobAccept?: (jobId: string) => Promise<void>;
  onJobReject?: (jobId: string) => void;
}

function analyzeContext(message: Message): string[] {
  return [];
}

export function ChatMessage({ message, onReply, onJobAccept, onJobReject }: ChatMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const contextualSuggestions = analyzeContext(message);
  const suggestedJobs = message.metadata?.suggestedJobs as any[] || [];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSpeechSynthesis(window.speechSynthesis);
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleReply = (reply: string) => {
    if (onReply) {
      onReply(reply);
    }
  };

  const playMessage = () => {
    if (!speechSynthesis) {
      toast.error("La synthèse vocale n'est pas supportée par votre navigateur");
      return;
    }

    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    try {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.content);
      
      const frenchVoice = voices.find(voice => 
        voice.lang.startsWith('fr') || 
        voice.lang.includes('FR')
      );
      
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }

      utterance.lang = 'fr-FR';
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = (event) => {
        console.error('Erreur de synthèse vocale:', event);
        toast.error("Erreur lors de la lecture du message");
        setIsPlaying(false);
      };

      speechSynthesis.speak(utterance);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing message:', error);
      toast.error("Erreur lors de la lecture du message");
      setIsPlaying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${message.sender_id === 'assistant' ? 'flex-row' : 'flex-row-reverse'} w-full`}
    >
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
        <motion.div 
          className="flex items-start gap-2 w-full"
          layout
        >
          <Card
            className={`px-4 py-2 ${
              message.sender_id === 'assistant' 
                ? 'bg-muted/50 backdrop-blur-sm border-primary/10' 
                : 'bg-primary text-primary-foreground'
            } max-w-[80%]`}
          >
            {message.thinking ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>En train de réfléchir...</span>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                
                {message.sender_id === 'assistant' && suggestedJobs.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-primary">Offres d'emploi pertinentes :</p>
                    {suggestedJobs.map((job: any) => (
                      <Card key={job.id} className="p-3 bg-background/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">{job.title}</h4>
                            <p className="text-xs text-muted-foreground">{job.company}</p>
                            {job.location && (
                              <p className="text-xs text-muted-foreground mt-1">{job.location}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onJobReject?.(job.id)}
                              className="h-8 w-8 p-0"
                            >
                              <ThumbsDown className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onJobAccept?.(job.id)}
                              className="h-8 w-8 p-0"
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
          
          {message.sender_id === 'assistant' && (
            <div className="flex flex-col gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={playMessage}
              >
                {isPlaying ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </motion.div>

        {message.sender_id === 'assistant' && contextualSuggestions.length > 0 && (
          <motion.div 
            className="flex flex-wrap gap-2 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {contextualSuggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => handleReply(suggestion)}
                className="bg-background/80 backdrop-blur-sm hover:bg-primary/10 text-sm flex items-center gap-2"
              >
                <Send className="h-3 w-3" />
                {suggestion}
              </Button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
