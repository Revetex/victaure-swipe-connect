import { Message, Receiver } from "@/types/messages"; 
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatThinking } from "@/components/chat/ChatThinking";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useProfile } from "@/hooks/useProfile";

export interface ConversationViewProps {
  messages: Message[];
  receiver: Receiver | null;
  inputMessage: string;
  isThinking?: boolean;
  isListening?: boolean;
  onInputChange: (message: string) => void;
  onSendMessage: () => void;
  onVoiceInput?: () => void;
  onBack: () => void;
  onDeleteConversation: () => Promise<void>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function ConversationView({
  messages,
  receiver,
  inputMessage,
  isThinking,
  isListening,
  onInputChange,
  onSendMessage,
  onVoiceInput,
  onBack,
  onDeleteConversation,
  messagesEndRef
}: ConversationViewProps) {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { profile } = useProfile();

  const handleScroll = (event: any) => {
    const target = event.target as HTMLDivElement;
    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReply = useCallback((content: string) => {
    if (content && onSendMessage) {
      onSendMessage();
    }
  }, [onSendMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!receiver) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background relative">
      <header className="flex-shrink-0 sticky top-0 left-0 right-0 bg-background/95 backdrop-blur z-[49] border-b">
        <ChatHeader
          title={receiver.full_name}
          subtitle={receiver.id === 'assistant' ? "Assistant virtuel" : receiver.online_status ? "En ligne" : "Hors ligne"}
          avatarUrl={receiver.avatar_url}
          onBack={onBack}
          onDelete={onDeleteConversation}
          isOnline={receiver.online_status}
          lastSeen={receiver.last_seen}
        />
      </header>

      <div className="flex-1 flex flex-col justify-end overflow-hidden">
        <ScrollArea 
          className="w-full px-4"
          onScrollCapture={handleScroll}
        >
          <div className="min-h-full space-y-4 py-4 max-w-2xl mx-auto w-full flex flex-col justify-end">
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
                  onReply={handleReply}
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
            
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </ScrollArea>
      </div>

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

      <footer className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t z-[48] p-4">
        <ChatInput
          value={inputMessage}
          onChange={onInputChange}
          onSend={onSendMessage}
          isThinking={isThinking}
          isListening={isListening}
          onVoiceInput={onVoiceInput}
          placeholder="Écrivez votre message..."
        />
      </footer>
    </div>
  );
}
