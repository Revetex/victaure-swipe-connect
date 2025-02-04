import { useState, useEffect } from "react";
import { MessagesContent } from "./MessagesContent";
import { ConversationList } from "./conversation/ConversationList";
import { useReceiver } from "@/hooks/useReceiver";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useChat } from "@/hooks/useChat";
import { Message, Receiver } from "@/types/messages";
import { toast } from "sonner";

interface MessagesWrapperProps {
  chatMessages?: Message[];
  inputMessage?: string;
  isListening?: boolean;
  isThinking?: boolean;
  showConversation?: boolean;
  setShowConversation?: (show: boolean) => void;
  handleSendMessage?: (message: string) => void;
  handleVoiceInput?: () => void;
  setInputMessage?: (message: string) => void;
  clearChat?: () => void;
  selectedReceiver?: Receiver | null;
  setSelectedReceiver?: (receiver: Receiver | null) => void;
}

export function MessagesWrapper() {
  const { showConversation, setShowConversation, receiver } = useReceiver();
  const {
    messages,
    inputMessage,
    isThinking,
    isListening,
    handleSendMessage,
    handleVoiceInput,
    setInputMessage,
    clearChat,
  } = useChat();

  const handleBack = () => {
    setShowConversation(false);
  };

  const handleSelectConversation = (type: "assistant" | "user", selectedReceiver?: any) => {
    console.log("Selecting conversation:", { type, selectedReceiver });
    
    if (type === "assistant") {
      const aiReceiver: Receiver = {
        id: 'assistant',
        full_name: 'M. Victaure',
        avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
        online_status: true,
        last_seen: new Date().toISOString()
      };
      setShowConversation(true);
    } else if (selectedReceiver) {
      // For regular user conversations
      setShowConversation(true);
    }
  };

  if (showConversation && receiver) {
    const isAIChat = receiver.id === 'assistant';
    console.log("Showing conversation for:", { receiver, isAIChat });

    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="flex h-16 items-center border-b px-4">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{receiver.full_name}</h2>
          </div>
        </div>
        <MessagesContent
          messages={messages}
          inputMessage={inputMessage}
          isThinking={isThinking}
          isListening={isListening}
          onSendMessage={handleSendMessage}
          onVoiceInput={handleVoiceInput}
          setInputMessage={setInputMessage}
          onBack={handleBack}
          receiver={receiver}
          onClearChat={clearChat}
        />
      </div>
    );
  }

  return (
    <div className="h-full">
      <ConversationList
        messages={messages}
        chatMessages={messages}
        onSelectConversation={handleSelectConversation}
      />
    </div>
  );
}