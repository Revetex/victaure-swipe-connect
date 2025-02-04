import { Message } from "@/types/messages";
import { UserMessage } from "./UserMessage";
import { AssistantMessage } from "./AssistantMessage";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConversationMessagesProps {
  messages: Message[];
  isThinking?: boolean;
  showScrollButton?: boolean;
  onScroll?: () => void;
  onScrollToBottom?: () => void;
}

export function ConversationMessages({
  messages,
  isThinking,
  showScrollButton = false,
  onScroll = () => {},
  onScrollToBottom = () => {}
}: ConversationMessagesProps) {
  const { user } = useAuth();
  const { deleteMessage } = useMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDelete = async (messageId: string) => {
    await deleteMessage.mutateAsync(messageId);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100vh-12rem)]" onScroll={onScroll}>
      <AnimatePresence initial={false}>
        {messages.map((message) => {
          const isUserMessage = typeof message.sender === 'string' 
            ? message.sender_id === user?.id 
            : message.sender.id === user?.id;

          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {isUserMessage ? (
                <UserMessage 
                  message={message} 
                  onDelete={() => handleDelete(message.id)}
                />
              ) : (
                <AssistantMessage 
                  chatMessages={[message]}
                  onSelectConversation={() => {}}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {isThinking && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2"
        >
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
        </motion.div>
      )}
      
      {showScrollButton && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-24 right-8 rounded-full shadow-lg"
          onClick={onScrollToBottom}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}