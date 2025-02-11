import { Message, Receiver } from "@/types/messages"; 
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatThinking } from "@/components/chat/ChatThinking";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
    try {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior
      });
    } catch (error) {
      console.error("Erreur de défilement:", error);
    }
  };

  const handleSendMessage = () => {
    try {
      onSendMessage();
      scrollToBottom();
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      toast.error("Impossible d'envoyer le message");
    }
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

  const lastMessage = messages[messages.length - 1];
  const lastMessageTime = lastMessage ? format(new Date(lastMessage.created_at), 'HH:mm', { locale: fr }) : '';

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex-shrink-0">
        <ChatHeader
          title="Messages"
          onBack={onBack}
          onDelete={onDeleteConversation}
        />
      </div>

      <div 
        ref={scrollAreaRef}
        onScroll={handleScroll}
        onTouchStart={() => setIsScrolling(true)}
        onTouchEnd={() => setIsScrolling(false)}
        onMouseDown={() => setIsScrolling(true)}
        onMouseUp={() => setIsScrolling(false)}
        className="flex-1 overflow-y-auto px-4 pt-4 scroll-smooth"
      >
        <div className="max-w-3xl mx-auto space-y-4 pb-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Commencez une nouvelle conversation
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.sender_id === profile.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[70%] md:max-w-[60%]">
                    <ChatMessage
                      content={message.content}
                      sender={message.sender_id === profile.id ? "user" : "assistant"}
                      timestamp={message.created_at}
                      isRead={message.read}
                      status={message.status}
                      reaction={message.reaction}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          
          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[70%] md:max-w-[60%]">
                <ChatThinking />
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex-shrink-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border-2 border-background">
                <AvatarImage 
                  src={receiver.avatar_url || ''} 
                  alt={receiver.full_name} 
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10">
                  {receiver.full_name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{receiver.full_name}</span>
                <span className={`text-xs ${receiver.online_status ? 'text-green-500' : 'text-muted-foreground'}`}>
                  {receiver.online_status ? 'En ligne' : 'Hors ligne'}
                </span>
              </div>
            </div>
            
            {lastMessage && (
              <div className="text-sm text-muted-foreground">
                Dernier message : {lastMessageTime}
              </div>
            )}
          </div>
        </div>

        <div className="p-4">
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
