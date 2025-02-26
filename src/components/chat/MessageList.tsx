
import { RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

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

export const MessageList = ({
  messages,
  isLoading,
  ref
}: MessageListProps) => {
  const handleSpeakMessage = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    speechSynthesis.speak(utterance);
    toast.success("Lecture du message");
  };

  return (
    <div className="flex flex-col gap-3 p-3" ref={ref}>
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "group flex items-end gap-2",
              message.isUser ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
              message.isUser 
                ? "bg-[#64B5D9] text-white" 
                : "bg-[#1B2A4A]/80 border border-[#64B5D9]/10 text-[#F2EBE4]"
            )}>
              {message.content}
              <div className="mt-1 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-[#F2EBE4]/60">
                  {message.timestamp ? format(message.timestamp, 'HH:mm', { locale: fr }) : ''}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSpeakMessage(message.content)}
                  className="h-6 w-6 rounded-full hover:bg-black/10"
                >
                  <Volume2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center p-2"
        >
          <Loader2 className="h-6 w-6 animate-spin text-[#64B5D9]" />
        </motion.div>
      )}
    </div>
  );
}
