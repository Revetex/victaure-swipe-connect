
import { useState } from "react";
import { ConversationList } from "./conversation/ConversationList";
import { ConversationView } from "./conversation/ConversationView";
import { useReceiver } from "@/hooks/useReceiver";
import { Card } from "../ui/card";
import { useMessages } from "@/hooks/useMessages";
import { useUserChat } from "@/hooks/useUserChat";
import { useAIChat } from "@/hooks/useAIChat";
import { useRef } from "react";

export function MessagesContainer() {
  const { receiver, setReceiver } = useReceiver();
  const [showConversation, setShowConversation] = useState(false);
  const { messages: userMessages } = useMessages();
  const { messages: aiMessages, inputMessage, isThinking, isListening, handleSendMessage: handleAISendMessage, handleVoiceInput, setInputMessage } = useAIChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSelectConversation = (selectedReceiver: any) => {
    setReceiver(selectedReceiver);
    setShowConversation(true);
  };

  const handleBack = () => {
    setShowConversation(false);
    setReceiver(null);
  };

  const handleDeleteConversation = async () => {
    // Implement delete conversation logic here
    handleBack();
  };

  // Wrapper function to match the expected signature
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      handleAISendMessage(inputMessage);
    }
  };

  return (
    <Card className="h-screen overflow-hidden flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {showConversation && receiver ? (
        <div className="flex-1 overflow-hidden">
          <ConversationView
            receiver={receiver}
            messages={receiver.id === 'assistant' ? aiMessages : userMessages}
            inputMessage={inputMessage}
            isThinking={isThinking}
            isListening={isListening}
            onInputChange={setInputMessage}
            onSendMessage={handleSendMessage}
            onVoiceInput={handleVoiceInput}
            onBack={handleBack}
            onDeleteConversation={handleDeleteConversation}
            messagesEndRef={messagesEndRef}
          />
        </div>
      ) : (
        <ConversationList
          messages={userMessages}
          chatMessages={aiMessages}
          onSelectConversation={handleSelectConversation}
        />
      )}
    </Card>
  );
}
