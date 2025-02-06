import { useEffect, useRef, useState } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { useAIChat } from "@/hooks/useAIChat";
import { useUserChat } from "@/hooks/useUserChat";
import { Receiver } from "@/types/messages";
import { ChatThinking } from "@/components/chat/ChatThinking";

interface ConversationViewProps {
  receiver: Receiver;
  onBack: () => void;
}

export function ConversationView({ receiver, onBack }: ConversationViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useProfile();
  const [showScrollButton, setShowScrollButton] = useState(false);

  const {
    messages: aiMessages,
    inputMessage: aiInputMessage,
    isThinking,
    handleSendMessage: handleAISendMessage,
    setInputMessage: setAIInputMessage,
    clearChat: clearAIChat,
  } = useAIChat();

  const {
    messages: userMessages,
    inputMessage: userInputMessage,
    handleSendMessage: handleUserSendMessage,
    setInputMessage: setUserInputMessage,
    clearChat: clearUserChat,
  } = useUserChat();

  const isAIChat = receiver.id === 'assistant';
  const messages = isAIChat ? aiMessages : userMessages;
  const inputMessage = isAIChat ? aiInputMessage : userInputMessage;
  const setInputMessage = isAIChat ? setAIInputMessage : setUserInputMessage;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const isNearBottom = 
      target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    try {
      if (isAIChat) {
        await handleAISendMessage(message);
      } else {
        await handleUserSendMessage(message, receiver);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Erreur lors de l'envoi du message");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        title={receiver.full_name}
        subtitle={isAIChat ? "Assistant virtuel" : "En ligne"}
        avatarUrl={receiver.avatar_url}
        onBack={onBack}
      />

      <ScrollArea className="flex-1 p-4" onScroll={handleScroll}>
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              sender={message.sender_id === profile?.id ? "user" : "assistant"}
              timestamp={message.created_at}
              isRead={message.read}
            />
          ))}
          {isThinking && <ChatThinking />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={() => handleSendMessage(inputMessage)}
          isThinking={isThinking}
          placeholder="Écrivez votre message..."
        />
      </div>
    </div>
  );
}