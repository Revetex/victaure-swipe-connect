
import { Message, Receiver } from "@/types/messages"; 
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatThinking } from "@/components/chat/ChatThinking";
import { Button } from "@/components/ui/button";
import { ChevronDown, Mic } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);

  const handleScroll = (event: any) => {
    const target = event.target as HTMLDivElement;
    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReply = useCallback(async (content: string) => {
    onInputChange(content);
    setTimeout(() => {
      onSendMessage();
    }, 100);
  }, [onInputChange, onSendMessage]);

  const startVoiceChat = async () => {
    try {
      setIsVoiceChatActive(true);
      // Demander la permission du microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Arrêter le stream test
      
      toast.success("Chat vocal activé! Cliquez sur le microphone pour parler.");
      if (onVoiceInput) {
        onVoiceInput();
      }
    } catch (error) {
      console.error("Erreur d'accès au microphone:", error);
      toast.error("Impossible d'accéder au microphone. Vérifiez vos permissions.");
      setIsVoiceChatActive(false);
    }
  };

  useEffect(() => {
    // Sauvegarder la conversation dans Supabase
    const saveConversation = async () => {
      if (!profile || !receiver || messages.length === 0) return;
      
      try {
        const { error } = await supabase
          .from('conversations')
          .upsert({
            user_id: profile.id,
            receiver_id: receiver.id,
            last_message: messages[messages.length - 1].content,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de la conversation:", error);
      }
    };

    saveConversation();
  }, [messages, profile, receiver]);

  if (!receiver) return null;

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex-none">
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

      <footer className="flex-none p-4 bg-background border-t">
        <div className="max-w-2xl mx-auto">
          {!isVoiceChatActive && (
            <Button
              onClick={startVoiceChat}
              className="w-full mb-4 gap-2"
              variant="outline"
            >
              <Mic className="w-4 h-4" />
              Activer le chat vocal
            </Button>
          )}
          <ChatInput
            value={inputMessage}
            onChange={onInputChange}
            onSend={onSendMessage}
            isThinking={isThinking}
            isListening={isListening}
            onVoiceInput={onVoiceInput}
            onFileAttach={(file) => {
              toast.success(`Fichier ${file.name} attaché`);
              // Implement file handling logic here
            }}
            placeholder="Écrivez votre message..."
          />
        </div>
      </footer>
    </div>
  );
}
