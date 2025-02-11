
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

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  if (!receiver) return null;

  const activeChatHeads = messages.slice(-3).map(message => ({
    id: message.sender_id,
    avatarUrl: message.sender_id === profile?.id ? profile?.avatar_url : receiver.avatar_url,
    name: message.sender_id === profile?.id ? profile?.full_name : receiver.full_name,
    isOnline: message.sender_id === profile?.id ? true : receiver.online_status,
  }));

  return (
    <div className="flex flex-col h-full bg-background">
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

      <ScrollArea 
        className="flex-1 px-4 pt-2 pb-20 w-full overflow-x-hidden"
        onScrollCapture={handleScroll}
      >
        <div className="space-y-4 py-2 min-h-full max-w-3xl mx-auto">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-[85%] mx-auto"
              >
                <ChatMessage
                  content={message.content}
                  sender={message.sender_id === profile?.id ? "user" : "assistant"}
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

      {showScrollButton && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-20 right-4 z-10"
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

      <footer className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t z-[48] p-4">
        {/* Chat Heads */}
        <div className="absolute -top-12 left-4 flex -space-x-3">
          {activeChatHeads.map((head, index) => (
            <motion.div
              key={`${head.id}-${index}`}
              initial={{ scale: 0, x: -20 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="h-10 w-10 rounded-full border-2 border-background overflow-hidden">
                <img 
                  src={head.avatarUrl || '/user-icon.svg'} 
                  alt={head.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {head.isOnline && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
              )}
            </motion.div>
          ))}
        </div>

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
