
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";

interface Message {
  content: string;
  isUser: boolean;
  timestamp: number;
}

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  onPlayVoice?: (text: string) => void;
  isSpeaking?: boolean;
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, isLoading, onPlayVoice, isSpeaking }, ref) => {
    return (
      <div 
        ref={ref}
        className="h-full pt-4 pb-2 px-3 overflow-y-auto flex flex-col-reverse"
      >
        <div className="space-y-3">
          {messages.map((message, index) => (
            <motion.div 
              key={index} 
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              layout="position"
            >
              <div 
                className={`flex-1 relative rounded-2xl px-3.5 py-2 ${
                  message.isUser 
                    ? 'bg-[#64B5D9] text-white rounded-br-sm ml-12' 
                    : 'bg-[#2A2D3E] text-[#F1F0FB] rounded-bl-sm mr-12'
                }`}
              >
                <div className="mb-1 flex justify-between items-center text-xs opacity-80">
                  <span>{message.isUser ? 'Vous' : 'Mr Victaure'}</span>
                  <span>
                    {format(new Date(message.timestamp), "d MMM à HH:mm", { locale: fr })}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <p className="text-sm leading-relaxed flex-1">{message.content}</p>
                  {!message.isUser && onPlayVoice && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`mt-1 ${isSpeaking ? 'text-primary' : 'text-muted-foreground'}`}
                      onClick={() => onPlayVoice(message.content)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div 
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex-1 relative bg-[#2A2D3E] rounded-2xl rounded-bl-sm px-4 py-3 mr-12">
                <div className="mb-1 flex justify-between items-center text-xs opacity-80">
                  <span>Mr Victaure</span>
                  <span>{format(new Date(), "d MMM à HH:mm", { locale: fr })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }
);

MessageList.displayName = "MessageList";
