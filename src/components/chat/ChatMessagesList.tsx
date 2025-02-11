
import { ChatMessage } from "./ChatMessage";
import { AIAssistantStatus } from "../dashboard/ai/AIAssistantStatus";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef } from "react";
import { Message } from "@/types/messages";

interface ChatMessagesListProps {
  messages: Message[];
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
      className="flex-1 px-4"
      onScrollCapture={onScroll}
    >
      <div className="space-y-4 py-4 max-w-3xl mx-auto">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground p-4"
          >
            Aucun message pour le moment. Commencez une conversation !
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
                sender={message.sender_id === 'assistant' ? 'assistant' : 'user'}
                timestamp={message.created_at}
                status={message.status}
                reaction={message.reaction}
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
