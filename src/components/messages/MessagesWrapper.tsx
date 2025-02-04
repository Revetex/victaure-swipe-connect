import { useState } from "react";
import { MessagesContent } from "./MessagesContent";
import { MessagesTabs } from "./MessagesTabs";
import { useReceiver } from "@/hooks/useReceiver";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useChat } from "@/hooks/useChat";
import { Message, Receiver } from "@/types/messages";

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
  const [activeTab, setActiveTab] = useState<"messages">("messages");
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

  if (showConversation && receiver) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="flex h-16 items-center border-b px-4">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{receiver.name}</h2>
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
      <MessagesTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}