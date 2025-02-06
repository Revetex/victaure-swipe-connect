
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
    if (selectedReceiver.id === 'assistant') {
      const aiReceiver: Receiver = {
        id: 'assistant',
        full_name: 'M. Victaure',
        avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
        online_status: true,
        last_seen: new Date().toISOString()
      };
      setReceiver(aiReceiver);
    } else {
      setReceiver(selectedReceiver);
    }
    setShowConversation(true);
  };

  const handleSendMessage = async (message: string) => {
    if (!receiver) {
      toast.error("Aucun destinataire sélectionné");
      return;
    }

    try {
      if (receiver.id === 'assistant') {
        if (isThinking) {
          toast.error("M. Victaure est en train de réfléchir. Veuillez patienter.");
          return;
        }
        await handleAISendMessage(message);
      } else {
        await handleUserSendMessage(message, receiver);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    }
  };

  const handleDeleteConversation = async () => {
    if (!receiver) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      if (receiver.id === 'assistant') {
        // Delete AI chat messages
        const { error: aiError } = await supabase
          .from('ai_chat_messages')
          .delete()
          .eq('user_id', user.id);

        if (aiError) throw aiError;
        clearAIChat();
      } else {
        // Delete all messages between the two users
        const { error: messagesError } = await supabase
          .from('messages')
          .delete()
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`);

        if (messagesError) throw messagesError;
        clearUserChat(receiver.id);
      }

      toast.success("Conversation supprimée définitivement");
      handleBack();
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error("Erreur lors de la suppression de la conversation");
    }
  };

  // Mark messages as read when conversation is opened
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!receiver || receiver.id === 'assistant') return;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
          .from('messages')
          .update({ read: true })
          .eq('sender_id', receiver.id)
          .eq('receiver_id', user.id)
          .eq('read', false);

        if (error) throw error;
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };

    if (showConversation) {
      markMessagesAsRead();
    }
  }, [showConversation, receiver]);

  if (showConversation && receiver) {
    const isAIChat = receiver.id === 'assistant';
    
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
          onClearChat={handleDeleteConversation}
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
