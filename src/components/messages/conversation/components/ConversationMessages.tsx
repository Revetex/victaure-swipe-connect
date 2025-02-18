
import { Message } from "@/types/messages";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatThinking } from "@/components/chat/ChatThinking";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface ConversationMessagesProps {
  messages: Message[];
  isThinking?: boolean;
  onReply: (content: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function ConversationMessages({ 
  messages, 
  isThinking, 
  onReply,
  messagesEndRef 
}: ConversationMessagesProps) {
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = (event: any) => {
    const target = event.target as HTMLDivElement;
    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <ScrollArea 
        className="flex-1 h-[calc(100vh-8rem)]"
        onScrollCapture={handleScroll}
      >
        <div className="px-4">
          <div className="space-y-4 py-4 max-w-2xl mx-auto">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ChatMessage 
                  message={message} 
                  onReply={onReply}
                />
              </motion.div>
            ))}
            
            {isThinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ChatThinking />
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </ScrollArea>

      {showScrollButton && (
        <Button
          size="icon"
          variant="secondary"
          onClick={scrollToBottom}
          className="absolute bottom-20 right-4 rounded-full shadow-lg hover:shadow-xl transition-shadow z-10"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}
