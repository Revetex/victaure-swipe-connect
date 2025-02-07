
import { useState, useRef } from "react";
import { ConversationList } from "./conversation/ConversationList";
import { ConversationView } from "./conversation/ConversationView";
import { useReceiver } from "@/hooks/useReceiver";
import { Card } from "../ui/card";
import { useMessages } from "@/hooks/useMessages";
import { useUserChat } from "@/hooks/useUserChat";
import { useAIChat } from "@/hooks/useAIChat";
import { toast } from "sonner";

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

  const handleSelectConversation = (selectedReceiver: any) => {
    try {
      setReceiver(selectedReceiver);
      setShowConversation(true);
    } catch (error) {
      console.error("Erreur lors de la sélection de la conversation:", error);
      toast.error("Impossible de charger la conversation");
    }
  };

  const handleBack = () => {
    try {
      setShowConversation(false);
      setReceiver(null);
    } catch (error) {
      console.error("Erreur lors du retour à la liste:", error);
      toast.error("Impossible de revenir à la liste des conversations");
    }
  };

  const handleDeleteConversation = async () => {
    try {
      handleBack();
      toast.success("Conversation supprimée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Impossible de supprimer la conversation");
    }
  };

  const handleSendMessage = () => {
    try {
      if (!receiver) {
        toast.error("Aucun destinataire sélectionné");
        return;
      }

      if (receiver?.id === 'assistant') {
        if (inputMessage.trim()) {
          handleAISendMessage(inputMessage);
        }
      } else {
        handleUserSendMessage(inputMessage, receiver);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Impossible d'envoyer le message");
    }
  };

  if (isLoading) {
    return (
      <Card className="h-screen flex items-center justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="text-muted-foreground">Chargement des messages...</div>
      </Card>
    );
  }

  return (
    <Card className="h-screen overflow-hidden flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {showConversation && receiver ? (
        <div className="flex-1 overflow-hidden">
          <ConversationView
            receiver={receiver}
            messages={receiver.id === 'assistant' ? aiMessages : userMessages}
            inputMessage={receiver.id === 'assistant' ? inputMessage : ''}
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
