import { Message } from "@/types/messages";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";

interface ConversationMessagesProps {
  messages: Message[];
  isThinking?: boolean;
  showScrollButton: boolean;
  onScroll: () => void;
  onScrollToBottom: () => void;
}

export function ConversationMessages({
  messages,
  isThinking,
  showScrollButton,
  onScroll,
  onScrollToBottom,
}: ConversationMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="flex-1 overflow-y-auto relative"
      onScroll={onScroll}
    >
      <div className="px-4 py-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              sender={typeof message.sender === 'string' ? message.sender : message.sender.id}
              thinking={message.thinking}
              showTimestamp={true}
              timestamp={message.created_at}
            />
          ))}
        </AnimatePresence>
        {isThinking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
              <div
                className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {showScrollButton && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-24 right-4 rounded-full shadow-lg"
          onClick={onScrollToBottom}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}