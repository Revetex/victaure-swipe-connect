import { useChat } from "@/hooks/useChat";
import { MessagesContent } from "./messages/MessagesContent";
import { useState } from "react";
import { MessagesList } from "./messages/conversation/MessagesList";
import { useMessages } from "@/hooks/useMessages";
import { toast } from "sonner";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

// Create a client
const queryClient = new QueryClient();

// Separate component for messages content
function MessagesWithQuery({
  chatMessages,
  inputMessage,
  isListening,
  isThinking,
  showConversation,
  setShowConversation,
  handleSendMessage,
  handleVoiceInput,
  setInputMessage,
  clearChat,
  selectedReceiver,
  setSelectedReceiver
}: {
  chatMessages: any[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  showConversation: boolean;
  setShowConversation: (show: boolean) => void;
  handleSendMessage: (message: string) => Promise<void>;
  handleVoiceInput: () => void;
  setInputMessage: (message: string) => void;
  clearChat: () => void;
  selectedReceiver: any;
  setSelectedReceiver: (receiver: any) => void;
}) {
  const { messages, markAsRead } = useMessages();

  const handleBack = () => {
    setShowConversation(false);
    setSelectedReceiver(null);
  };

  const handleSelectConversation = async (type: "assistant" | "user", receiver?: any) => {
    try {
      if (type === "user" && receiver) {
        setSelectedReceiver(receiver);
      }
      setShowConversation(true);
    } catch (error) {
      console.error("Error selecting conversation:", error);
      toast.error("Erreur lors de la sélection de la conversation");
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await markAsRead.mutate(messageId);
    } catch (error) {
      console.error("Error marking message as read:", error);
      toast.error("Erreur lors du marquage du message comme lu");
    }
  };

  const handleSendMessageWithFeedback = async (message: string) => {
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
  };

  return showConversation ? (
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
      receiver={selectedReceiver}
    />
  ) : (
    <MessagesList
      messages={messages}
      chatMessages={chatMessages}
      onSelectConversation={handleSelectConversation}
      onMarkAsRead={handleMarkAsRead}
    />
  );
}

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

  const [showConversation, setShowConversation] = useState(false);
  const [selectedReceiver, setSelectedReceiver] = useState<any>(null);

  // Fetch receiver profile when conversation is opened from URL
  useEffect(() => {
    const fetchReceiverFromUrl = async () => {
      const path = window.location.pathname;
      const match = path.match(/\/messages\/([^\/]+)/);
      
      if (match) {
        const receiverId = match[1];
        const { data: receiver } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', receiverId)
          .single();

        if (receiver) {
          setSelectedReceiver(receiver);
          setShowConversation(true);
        }
      }
    };

    fetchReceiverFromUrl();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-full flex flex-col">
        <MessagesWithQuery
          chatMessages={chatMessages}
          inputMessage={inputMessage}
          isListening={isListening}
          isThinking={isThinking}
          showConversation={showConversation}
          setShowConversation={setShowConversation}
          handleSendMessage={handleSendMessage}
          handleVoiceInput={handleVoiceInput}
          setInputMessage={setInputMessage}
          clearChat={clearChat}
          selectedReceiver={selectedReceiver}
          setSelectedReceiver={setSelectedReceiver}
        />
      </div>
    </QueryClientProvider>
  );
}