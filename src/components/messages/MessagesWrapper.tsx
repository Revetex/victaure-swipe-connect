import { useState, useEffect } from "react";
import { MessagesContent } from "./MessagesContent";
import { ConversationList } from "./conversation/ConversationList";
import { useReceiver } from "@/hooks/useReceiver";
import { useAIChat } from "@/hooks/useAIChat";
import { useUserChat } from "@/hooks/useUserChat";
import { Receiver } from "@/types/messages";
import { toast } from "sonner";
import { ChatHeader } from "../chat/ChatHeader";

export function MessagesWrapper() {
  const { showConversation, setShowConversation, receiver, setReceiver } = useReceiver();
  const {
    messages: aiMessages,
    inputMessage: aiInputMessage,
    isThinking,
    isListening,
    handleSendMessage: handleAISendMessage,
    handleVoiceInput,
    setInputMessage: setAIInputMessage,
    clearChat: clearAIChat,
  } = useAIChat();

  const {
    messages: userMessages,
    inputMessage: userInputMessage,
    isLoading,
    handleSendMessage: handleUserSendMessage,
    setInputMessage: setUserInputMessage,
    clearChat: clearUserChat,
  } = useUserChat();

  const handleBack = () => {
    setShowConversation(false);
    setReceiver(null);
  };

  const handleSelectConversation = (type: "assistant" | "user", selectedReceiver?: Receiver) => {
    if (type === "assistant") {
      const aiReceiver: Receiver = {
        id: 'assistant',
        full_name: 'M. Victaure',
        avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
        online_status: true,
        last_seen: new Date().toISOString()
      };
      setReceiver(aiReceiver);
      setShowConversation(true);
    } else if (selectedReceiver) {
      setReceiver(selectedReceiver);
      setShowConversation(true);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!receiver) {
      toast.error("Aucun destinataire sélectionné");
      return;
    }

    try {
      if (receiver.id === 'assistant') {
        await handleAISendMessage(message);
      } else {
        await handleUserSendMessage(message, receiver);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    }
  };

  if (showConversation && receiver) {
    const isAIChat = receiver.id === 'assistant';
    console.log("Showing conversation for:", { receiver, isAIChat });

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
        <ChatHeader
          onBack={handleBack}
          title={receiver.full_name}
          subtitle={isAIChat ? "Assistant de Placement Virtuel" : "En ligne"}
          avatarUrl={receiver.avatar_url}
          isThinking={isAIChat ? isThinking : false}
        />
        
        <MessagesContent
          messages={isAIChat ? aiMessages : userMessages}
          inputMessage={isAIChat ? aiInputMessage : userInputMessage}
          isThinking={isThinking}
          isListening={isListening}
          onSendMessage={handleSendMessage}
          onVoiceInput={isAIChat ? handleVoiceInput : undefined}
          setInputMessage={isAIChat ? setAIInputMessage : setUserInputMessage}
          onBack={handleBack}
          receiver={receiver}
          onClearChat={isAIChat ? clearAIChat : () => clearUserChat(receiver.id)}
        />
      </div>
    );
  }

  return (
    <div className="h-full">
      <ConversationList
        messages={userMessages}
        chatMessages={aiMessages}
        onSelectConversation={handleSelectConversation}
      />
    </div>
  );
}