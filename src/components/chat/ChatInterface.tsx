
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChatContainer } from "./ChatContainer";
import { ChatMessagesList } from "./ChatMessagesList";
import { ChatScrollButton } from "./ChatScrollButton";
import { ChatInput } from "./ChatInput";
import { useUserChat } from "@/hooks/useUserChat";

export function ChatInterface() {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useProfile();
  const { messages, handleSendMessage: sendMessage } = useUserChat();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const isNearBottom = 
      target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isThinking) return;

    try {
      setIsThinking(true);
      
      await sendMessage(input, {
        id: 'assistant',
        full_name: 'M. Victaure',
        avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
        online_status: true,
        last_seen: new Date().toISOString()
      });

      setInput("");
      scrollToBottom();

    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <ChatContainer>
      <motion.div 
        initial={false}
        animate={{ 
          borderColor: isThinking ? "hsl(var(--primary))" : "transparent" 
        }}
        className="p-4 border-b transition-colors duration-200"
      >
        <h2 className="text-xl font-semibold">Chat avec M. Victaure</h2>
        <p className="text-sm text-muted-foreground">
          Votre assistant personnel
        </p>
      </motion.div>

      <ChatMessagesList
        messages={messages}
        isThinking={isThinking}
        onScroll={handleScroll}
        messagesEndRef={messagesEndRef}
      />

      <AnimatePresence>
        {showScrollButton && (
          <ChatScrollButton 
            show={showScrollButton}
            onClick={scrollToBottom}
          />
        )}
      </AnimatePresence>

      <div className="p-4 border-t bg-background/95 backdrop-blur-sm sticky bottom-0 z-50">
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSendMessage}
          isThinking={isThinking}
          placeholder="Posez vos questions à M. Victaure..."
        />
      </div>
    </ChatContainer>
  );
}
