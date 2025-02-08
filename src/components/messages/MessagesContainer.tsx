
import { useState, useRef } from "react";
import { ConversationList } from "./conversation/ConversationList";
import { ConversationView } from "./conversation/ConversationView";
import { useReceiver } from "@/hooks/useReceiver";
import { Card } from "../ui/card";
import { useMessages } from "@/hooks/useMessages";
import { useUserChat } from "@/hooks/useUserChat";
import { useAIChat } from "@/hooks/useAIChat";
import { toast } from "sonner";
import { useConversationDelete } from "@/hooks/useConversationDelete";

export function MessagesContainer() {
  const { receiver, setReceiver } = useReceiver();
  const [showConversation, setShowConversation] = useState(false);
  const { 
    messages: userMessages, 
    isLoading, 
    handleSendMessage: handleUserSendMessage 
  } = useMessages();
  const { 
    messages: aiMessages, 
    inputMessage, 
    isThinking, 
    isListening, 
    handleSendMessage: handleAISendMessage, 
    handleVoiceInput, 
    setInputMessage 
  } = useAIChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { handleDeleteConversation } = useConversationDelete();

  const handleSelectConversation = (selectedReceiver: any) => {
    setReceiver(selectedReceiver);
    setShowConversation(true);
    setInputMessage('');
  };

  const handleBack = () => {
    setShowConversation(false);
    setReceiver(null);
    setInputMessage('');
  };

  const handleSendMessage = () => {
    if (!receiver) {
      toast.error("Aucun destinataire sélectionné");
      return;
    }

    if (!inputMessage.trim()) {
      toast.error("Le message ne peut pas être vide");
      return;
    }

    if (receiver.id === 'assistant') {
      handleAISendMessage(inputMessage);
    } else {
      handleUserSendMessage(inputMessage, receiver);
    }
    
    setInputMessage('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)] bg-background">
        <div className="text-muted-foreground">Chargement des messages...</div>
      </div>
    );
  }

  return (
    <Card className="h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)] overflow-hidden flex flex-col bg-background relative mt-16 mb-16">
      {showConversation && receiver ? (
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
          onDeleteConversation={() => handleDeleteConversation(receiver)}
          messagesEndRef={messagesEndRef}
        />
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
