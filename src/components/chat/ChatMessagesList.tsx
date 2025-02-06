
import { ChatMessage } from "./ChatMessage";
import { AIAssistantStatus } from "../dashboard/ai/AIAssistantStatus";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef } from "react";
import { ChatMessage as ChatMessageType } from "@/hooks/chat/useRealtimeChat";

interface ChatMessagesListProps {
  messages: ChatMessageType[];
  isThinking: boolean;
  onScroll: (event: any) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function ChatMessagesList({ 
  messages, 
  isThinking, 
  onScroll,
  messagesEndRef 
}: ChatMessagesListProps) {
  return (
    <ScrollArea 
      className="flex-1 p-4"
      onScrollCapture={onScroll}
    >
      <div className="space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground p-4"
          >
            Aucun message pour le moment. Commencez une conversation avec M. Victaure !
          </motion.div>
        )}
        
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ChatMessage
                content={message.content}
                sender={message.sender}
                timestamp={message.created_at}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isThinking && <AIAssistantStatus isThinking={true} />}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
