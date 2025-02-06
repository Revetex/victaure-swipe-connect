
import { useState, useEffect } from "react";
import { MessagesContent } from "./MessagesContent";
import { ConversationList } from "./conversation/ConversationList";
import { useReceiver } from "@/hooks/useReceiver";
import { useAIChat } from "@/hooks/useAIChat";
import { useUserChat } from "@/hooks/useUserChat";
import { Receiver } from "@/types/messages";
import { toast } from "sonner";
import { ChatHeader } from "../chat/ChatHeader";
import { supabase } from "@/integrations/supabase/client";

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
    handleSendMessage: handleUserSendMessage,
    setInputMessage: setUserInputMessage,
    clearChat: clearUserChat,
  } = useUserChat();

  const handleBack = () => {
    setShowConversation(false);
    setReceiver(null);
  };

  const handleSelectConversation = (selectedReceiver: Receiver) => {
    setReceiver(selectedReceiver);
    setShowConversation(true);
  };

  const handleSendMessage = async (message: string) => {
    if (!receiver) {
      toast.error("Aucun destinataire sélectionné");
      return;
    }

    if (!message.trim()) {
      return;
    }

    try {
      await handleUserSendMessage(message, receiver);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    }
  };

  const handleDeleteConversation = async () => {
    if (!receiver) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non authentifié");

      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`);

      if (messagesError) throw messagesError;
      clearUserChat(receiver.id);
      toast.success(`Conversation avec ${receiver.full_name} supprimée définitivement`);
      handleBack();
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error("Erreur lors de la suppression de la conversation. Veuillez réessayer.");
    }
  };

  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!receiver) return;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
          .from('messages')
          .update({ read: true })
          .eq('sender_id', receiver.id)
          .eq('receiver_id', user.id)
          .eq('read', false);

        if (error) {
          console.error('Error marking messages as read:', error);
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };

    let timeoutId: number;
    if (showConversation && receiver) {
      timeoutId = window.setTimeout(markMessagesAsRead, 500);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [showConversation, receiver]);

  if (showConversation && receiver) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
        <ChatHeader
          onBack={handleBack}
          title={receiver.full_name}
          subtitle="En ligne"
          avatarUrl={receiver.avatar_url}
        />
        
        <MessagesContent
          messages={userMessages}
          inputMessage={userInputMessage}
          isThinking={false}
          isListening={false}
          onSendMessage={handleSendMessage}
          setInputMessage={setUserInputMessage}
          onBack={handleBack}
          receiver={receiver}
          onClearChat={handleDeleteConversation}
        />
      </div>
    );
  }

  return (
    <div className="h-full">
      <ConversationList
        messages={userMessages}
        chatMessages={[]}
        onSelectConversation={handleSelectConversation}
      />
    </div>
  );
}
