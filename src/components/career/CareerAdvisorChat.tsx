import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { QuickSuggestions } from "./QuickSuggestions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/chat/messageTypes";
import { useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";

interface CareerAdvisorChatProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export function CareerAdvisorChat({
  messages,
  isLoading,
  onSendMessage,
}: CareerAdvisorChatProps) {
  const { profile } = useProfile();

  // Send initial greeting when chat starts
  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage = profile?.full_name 
        ? `Bonjour ${profile.full_name}! Je suis là pour vous aider dans votre développement professionnel. Parlons de vos objectifs et aspirations. Que souhaitez-vous accomplir dans votre carrière?`
        : "Bonjour! Je suis là pour vous guider dans votre parcours professionnel. Pour mieux vous conseiller, j'aimerais en savoir plus sur vous. Quel est votre domaine d'activité actuel?";
      onSendMessage(initialMessage);
    }
  }, [messages.length, profile, onSendMessage]);

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh]">
      <ScrollArea className="flex-1 p-4">
        <ChatMessages 
          messages={messages} 
          isTyping={isLoading} 
        />
      </ScrollArea>

      <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
        <QuickSuggestions onSelect={onSendMessage} />
        <ChatInput isLoading={isLoading} onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}