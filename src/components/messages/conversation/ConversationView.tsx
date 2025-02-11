
import { Message, Receiver } from "@/types/messages"; 
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatThinking } from "@/components/chat/ChatThinking";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
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
  const { profile } = useProfile();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = () => {
    if (!scrollAreaRef.current) return;
    
    const { scrollHeight, scrollTop, clientHeight } = scrollAreaRef.current;
    const bottom = scrollHeight - scrollTop - clientHeight < 100;
    setIsAtBottom(bottom);
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (!scrollAreaRef.current) return;
    
    const scrollHeight = scrollAreaRef.current.scrollHeight;
    const height = scrollAreaRef.current.clientHeight;
    const maxScrollTop = scrollHeight - height;
    
    scrollAreaRef.current.scrollTo({
      top: maxScrollTop > 0 ? maxScrollTop : 0,
      behavior
    });
  };

  useEffect(() => {
    if (isAtBottom && !isScrolling) {
      scrollToBottom('instant');
    }
  }, [messages, isAtBottom, isScrolling]);

  useEffect(() => {
    scrollToBottom('instant');
    
    const observer = new ResizeObserver(() => {
      if (isAtBottom) {
        scrollToBottom('instant');
      }
    });

    if (scrollAreaRef.current) {
      observer.observe(scrollAreaRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!receiver || !profile) return null;

  return (
    <div className="flex flex-col h-[100dvh]">
      <div className="flex-none">
        <ChatHeader
          title={receiver.full_name}
          subtitle={receiver.online_status ? "En ligne" : "Hors ligne"}
          avatarUrl={receiver.avatar_url}
          onBack={onBack}
          onDelete={onDeleteConversation}
          isOnline={receiver.online_status}
          lastSeen={receiver.last_seen}
        />
      </div>

      <div 
        ref={scrollAreaRef}
        onScroll={handleScroll}
        onTouchStart={() => setIsScrolling(true)}
        onTouchEnd={() => setIsScrolling(false)}
        onMouseDown={() => setIsScrolling(true)}
        onMouseUp={() => setIsScrolling(false)}
        className="flex-1 overflow-y-auto"
      >
        <div className="flex flex-col justify-end min-h-full">
          <div className="max-w-3xl mx-auto w-full px-4 py-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                Commencez une nouvelle conversation
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((message) => {
                  const isUserMessage = message.sender_id === profile.id;
                  const isAIMessage = message.sender_id === 'assistant';
                  
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] md:max-w-[60%] ${isAIMessage ? 'bg-primary/5 rounded-lg p-1' : ''}`}>
                        <ChatMessage
                          content={message.content}
                          sender={isUserMessage ? "user" : "assistant"}
                          timestamp={message.created_at}
                          isRead={message.read}
                          status={message.status}
                          reaction={message.reaction}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
            
            {isThinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[70%] md:max-w-[60%] bg-primary/5 rounded-lg p-1">
                  <ChatThinking />
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="flex-none border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-4 max-w-3xl mx-auto">
          <ChatInput
            value={inputMessage}
            onChange={onInputChange}
            onSend={onSendMessage}
            isThinking={isThinking}
            isListening={isListening}
            onVoiceInput={onVoiceInput}
            placeholder="Écrivez votre message..."
          />
        </div>
      </div>
    </div>
  );
}
