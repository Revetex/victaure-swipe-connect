
import { RefObject } from "react";
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

export const MessageList = ({
  messages,
  isLoading,
  ref
}: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={ref}>
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.isUser
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {message.content}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {isLoading && (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
};
