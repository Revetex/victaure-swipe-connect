
import { Message } from "@/types/messages";
import { ChatMessage } from "./ChatMessage";
import { AIAssistantStatus } from "../dashboard/ai/AIAssistantStatus";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col pb-20">
      <ScrollArea 
        className="flex-1 px-4"
        onScrollCapture={onScroll}
        ref={scrollAreaRef}
      >
        <div className="max-w-3xl mx-auto py-4 flex flex-col-reverse">
          <div className="space-y-4">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-muted-foreground p-2"
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
                  className={cn(
                    "flex w-full",
                    message.is_assistant ? "justify-start" : "justify-end"
                  )}
                >
                  <ChatMessage message={message} />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isThinking && <AIAssistantStatus isThinking={true} />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
