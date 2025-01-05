import { useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { QuickSuggestions } from "./QuickSuggestions";
import { ProfileEditor } from "./ProfileEditor";
import { ChatMessages } from "./ChatMessages";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat/messageTypes";
import { v4 as uuidv4 } from 'uuid';

export function CareerAdvisorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { profile, setProfile } = useProfile();

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
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la communication avec le conseiller",
        variant: "destructive",
      });
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
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la communication avec le conseiller",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      <ChatHeader isLoading={isTyping} />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <ProfileEditor profile={profile} setProfile={setProfile} />
        <QuickSuggestions onSelect={handleSuggestionSelect} />
        <ChatMessages messages={messages} isTyping={isTyping} />
      </div>

      <div className="p-4 border-t border-gray-800">
        <ChatInput isLoading={isTyping} onSendMessage={handleMessageSubmit} />
      </div>
    </div>
  );
}