
import { RefObject, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { speaker } from "@/utils/speaker";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Message {
  content: string;
  isUser: boolean;
  username?: string;
  timestamp?: number;
}

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  ref?: RefObject<HTMLDivElement>;
}

export const MessageList = ({ messages, isLoading, ref }: MessageListProps) => {
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);

  const handleSpeak = (text: string, index: number) => {
    try {
      if (speakingMessageId === index) {
        speaker.stop();
        setSpeakingMessageId(null);
      } else {
        if (speakingMessageId !== null) {
          speaker.stop();
        }
        speaker.speak(text);
        setSpeakingMessageId(index);
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
          setSpeakingMessageId(null);
        };
      }
    } catch (error) {
      console.error("Erreur de synthèse vocale:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-b from-[#F1F0FB]/80 via-[#F1F0FB]/60 to-[#F1F0FB]/40 dark:from-[#1A1F2C]/90 dark:via-[#1B2A4A]/70 dark:to-[#1B2A4A]/50">
      <div ref={ref} className="flex-1 p-6 space-y-6 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div 
              key={index}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div 
                className={`relative group max-w-[85%] sm:max-w-[75%] ${
                  message.isUser 
                    ? 'bg-[#64B5D9] text-white rounded-2xl rounded-br-sm ml-12 shadow-lg hover:shadow-xl transition-shadow duration-200' 
                    : 'bg-[#1B2A4A] text-[#F1F0FB] rounded-2xl rounded-bl-sm mr-12 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-[#64B5D9]/10'
                }`}
              >
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium opacity-90">
                      {message.isUser ? 'Vous' : 'Mr. Victaure'}
                    </span>
                    <span className="text-xs opacity-50">
                      {message.timestamp ? (
                        format(new Date(message.timestamp), 'HH:mm', { locale: fr })
                      ) : (
                        format(new Date(), 'HH:mm', { locale: fr })
                      )}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  {!message.isUser && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -right-10 top-2 opacity-70 hover:opacity-100 transition-opacity bg-[#1B2A4A]/40 hover:bg-[#1B2A4A]/60"
                      onClick={() => handleSpeak(message.content, index)}
                    >
                      {speakingMessageId === index ? (
                        <VolumeX className="h-4 w-4 text-[#64B5D9]" />
                      ) : (
                        <Volume2 className="h-4 w-4 text-[#64B5D9]" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start"
            >
              <div className="bg-[#1B2A4A] rounded-2xl p-3 shadow-lg border border-[#64B5D9]/10">
                <Loader2 className="w-4 h-4 text-[#64B5D9] animate-spin"/>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
