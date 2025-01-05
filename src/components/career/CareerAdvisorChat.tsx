import { useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { QuickSuggestions } from "./QuickSuggestions";
import { ChatMessages } from "./ChatMessages";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat/messageTypes";
import { v4 as uuidv4 } from 'uuid';
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

export function CareerAdvisorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { profile } = useProfile();

  const createMessage = (content: string, sender: string): Message => ({
    id: uuidv4(),
    content,
    sender,
    timestamp: new Date(),
  });

  const handleSuggestionSelect = async (suggestion: string) => {
    setMessages((prev) => [...prev, createMessage(suggestion, "user")]);
    setIsTyping(true);

    try {
      const { data: response } = await supabase.functions.invoke('career-advisor', {
        body: { message: suggestion, userId: profile?.id }
      });

      setMessages((prev) => [...prev, createMessage(response.response, "advisor")]);
    } catch (err) {
      console.error('Error:', err);
      toast.error("Une erreur est survenue lors de la communication avec le conseiller");
    } finally {
      setIsTyping(false);
    }
  };

  const handleMessageSubmit = async (message: string) => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, createMessage(message, "user")]);
    setIsTyping(true);

    try {
      const { data: response } = await supabase.functions.invoke('career-advisor', {
        body: { message, userId: profile?.id }
      });

      setMessages((prev) => [...prev, createMessage(response.response, "advisor")]);
    } catch (err) {
      console.error('Error:', err);
      toast.error("Une erreur est survenue lors de la communication avec le conseiller");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full bg-background"
    >
      <ChatHeader isLoading={isTyping} />
      
      <ScrollArea className="flex-1 p-4">
        <QuickSuggestions onSelect={handleSuggestionSelect} />
        <ChatMessages messages={messages} isTyping={isTyping} />
      </ScrollArea>
      
      <div className="p-4 border-t">
        <ChatInput isLoading={isTyping} onSendMessage={handleMessageSubmit} />
      </div>
    </motion.div>
  );
}