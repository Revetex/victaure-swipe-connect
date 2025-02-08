
import { Message, Receiver } from "@/types/messages"; 
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatThinking } from "@/components/chat/ChatThinking";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export interface ConversationViewProps {
  messages: Message[];
  receiver: Receiver;
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

  const handleScroll = (event: any) => {
    const target = event.target as HTMLDivElement;
    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <ChatHeader
          title={receiver.full_name}
          subtitle={receiver.id === 'assistant' ? "Assistant virtuel" : receiver.online_status ? "En ligne" : "Hors ligne"}
          avatarUrl={receiver.avatar_url}
          onBack={onBack}
          onDelete={onDeleteConversation}
          isOnline={receiver.online_status}
          lastSeen={receiver.last_seen}
        />
      </div>

      <ScrollArea 
        className="flex-1 px-4 py-6"
        onScrollCapture={handleScroll}
      >
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground p-4"
            >
              Commencez une conversation avec {receiver.full_name}
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative"
              >
                <ChatMessage
                  content={message.content}
                  sender={message.sender_id === receiver.id ? "assistant" : "user"}
                  timestamp={message.created_at}
                  isRead={message.read}
                  status={message.status}
                  reaction={message.reaction}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
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
      </ScrollArea>

      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-24 right-4 z-30"
          >
            <Button
              size="icon"
              variant="secondary"
              onClick={scrollToBottom}
              className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sticky bottom-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t">
        <ChatInput
          value={inputMessage}
          onChange={onInputChange}
          onSend={onSendMessage}
          isThinking={isThinking}
          isListening={isListening}
          onVoiceInput={onVoiceInput}
          placeholder={`Écrivez votre message à ${receiver.full_name}...`}
        />
      </div>
    </div>
  );
}
