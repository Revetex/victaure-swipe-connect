import { useChat } from "@/hooks/useChat";
import { MessagesContent } from "./messages/MessagesContent";
import { useState, useCallback } from "react";
import { MessagesList } from "./messages/conversation/MessagesList";
import { useMessages } from "@/hooks/useMessages";
import { toast } from "sonner";

export function Messages() {
  const {
    messages: chatMessages = [], // Ensure default empty array
    inputMessage = "", // Add default empty string
    isListening = false, // Add default false
    isThinking = false, // Add default false
    setInputMessage = () => {}, // Add default noop
    handleSendMessage = async () => {}, // Add default async noop
    handleVoiceInput = () => {}, // Add default noop
    clearChat = () => {} // Add default noop
  } = useChat() || {}; // Add fallback empty object

  const { 
    messages = [], // Ensure default empty array
    markAsRead 
  } = useMessages() || {}; // Add fallback empty object

  const [showConversation, setShowConversation] = useState(false);
  const [selectedModel, setSelectedModel] = useState("mistralai/Mixtral-8x7B-Instruct-v0.1");

  const handleBack = useCallback(() => {
    setShowConversation(false);
  }, []);

  const handleSelectConversation = useCallback(async (type: "assistant") => {
    try {
      setShowConversation(true);
    } catch (error) {
      console.error("Error selecting conversation:", error);
      toast.error("Erreur lors de la sélection de la conversation");
    }
  }, []);

  const handleMarkAsRead = useCallback(async (messageId: string) => {
    if (!markAsRead?.mutate) {
      console.error("markAsRead.mutate is not available");
      return;
    }

    try {
      await markAsRead.mutate(messageId);
    } catch (error) {
      console.error("Error marking message as read:", error);
      toast.error("Erreur lors du marquage du message comme lu");
    }
  }, [markAsRead]);

  const handleSendMessageWithFeedback = useCallback(async (message: string) => {
    if (!message?.trim()) {
      toast.error("Veuillez entrer un message");
      return;
    }

    if (!handleSendMessage) {
      console.error("handleSendMessage is not available");
      return;
    }

    try {
      // Only pass the message to handleSendMessage, handle model selection internally
      await handleSendMessage(message);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erreur lors de l'envoi du message. Veuillez réessayer.");
    }
  }, [handleSendMessage]);

  // Ensure all required props have default values
  const safeProps = {
    messages: Array.isArray(chatMessages) ? chatMessages : [],
    inputMessage: inputMessage || "",
    isListening: !!isListening,
    isThinking: !!isThinking,
    onSendMessage: handleSendMessageWithFeedback,
    onVoiceInput: handleVoiceInput || (() => {}),
    setInputMessage: setInputMessage || (() => {}),
    onClearChat: clearChat || (() => {}),
    onBack: handleBack,
    showingChat: showConversation,
    selectedModel,
    onModelChange: setSelectedModel
  };

  return (
    <div className="h-full flex flex-col">
      {showConversation ? (
        <MessagesContent {...safeProps} />
      ) : (
        <MessagesList
          messages={Array.isArray(messages) ? messages : []}
          chatMessages={Array.isArray(chatMessages) ? chatMessages : []}
          onSelectConversation={handleSelectConversation}
          onMarkAsRead={handleMarkAsRead}
        />
      )}
    </div>
  );
}