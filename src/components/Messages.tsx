import { useChat } from "@/hooks/useChat";
import { MessagesContent } from "./messages/MessagesContent";
import { useState, useCallback } from "react";
import { MessagesList } from "./messages/conversation/MessagesList";
import { useMessages } from "@/hooks/useMessages";
import { toast } from "sonner";

export function Messages() {
  const {
    messages: chatMessages,
    inputMessage,
    isListening,
    isThinking,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    clearChat
  } = useChat();

  const { messages, markAsRead } = useMessages();
  const [showConversation, setShowConversation] = useState(false);

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
    try {
      await markAsRead.mutate(messageId);
    } catch (error) {
      console.error("Error marking message as read:", error);
      toast.error("Erreur lors du marquage du message comme lu");
    }
  }, [markAsRead]);

  const handleSendMessageWithFeedback = useCallback(async (message: string) => {
    if (!message.trim()) {
      toast.error("Veuillez entrer un message");
      return;
    }

    try {
      await handleSendMessage(message);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erreur lors de l'envoi du message. Veuillez réessayer.");
    }
  }, [handleSendMessage]);

  return (
    <div className="h-full flex flex-col">
      {showConversation ? (
        <MessagesContent
          messages={chatMessages}
          inputMessage={inputMessage}
          isListening={isListening}
          isThinking={isThinking}
          onSendMessage={handleSendMessageWithFeedback}
          onVoiceInput={handleVoiceInput}
          setInputMessage={setInputMessage}
          onClearChat={clearChat}
          onBack={handleBack}
          showingChat={showConversation}
        />
      ) : (
        <MessagesList
          messages={messages}
          chatMessages={chatMessages}
          onSelectConversation={handleSelectConversation}
          onMarkAsRead={handleMarkAsRead}
        />
      )}
    </div>
  );
}