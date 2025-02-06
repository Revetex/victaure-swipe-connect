
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useRealtimeChat } from "@/hooks/chat/useRealtimeChat";
import { ChatContainer } from "./ChatContainer";
import { ChatMessagesList } from "./ChatMessagesList";
import { ChatScrollButton } from "./ChatScrollButton";
import { ChatInput } from "./ChatInput";

export function ChatInterface() {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useProfile();
  const { messages, addMessage } = useRealtimeChat();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = (event: any) => {
    const target = event.target as HTMLDivElement;
    const isNearBottom = 
      target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isThinking) return;

    try {
      setIsThinking(true);
      
      // Save user message
      const userMessage = await addMessage(input, 'user');
      if (!userMessage) return;

      setInput("");
      scrollToBottom();

      // Get AI response
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: input,
          context: {
            previousMessages: messages.slice(-5),
            userProfile: profile
          }
        }
      });

      if (error) throw error;

      // Save AI response
      await addMessage(data.response, 'assistant');
      scrollToBottom();

    } catch (error) {
      console.error('Error:', error);
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

      <ChatScrollButton 
        show={showScrollButton}
        onClick={scrollToBottom}
      />

      <div className="p-4 border-t">
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
