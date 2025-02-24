
import { forwardRef, useState, useEffect } from "react";
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
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, isLoading }, ref) => {
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
      <div 
        ref={ref}
        className="flex flex-col justify-end min-h-full p-4"
      >
        <div className="space-y-4 pb-2">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div 
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                layout="position"
              >
                <div 
                  className={`relative group max-w-[85%] sm:max-w-[75%] ${
                    message.isUser 
                      ? 'bg-[#64B5D9] text-white rounded-2xl rounded-br-sm ml-12 shadow-lg' 
                      : 'bg-[#1B2A4A] text-[#F1F0FB] rounded-2xl rounded-bl-sm mr-12 shadow-lg border border-[#64B5D9]/10'
                  }`}
                >
                  <div className="p-3 space-y-1">
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
  }
);

MessageList.displayName = "MessageList";
