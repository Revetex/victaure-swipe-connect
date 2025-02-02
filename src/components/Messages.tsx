import { useChat } from "@/hooks/useChat";
import { MessagesContent } from "./messages/MessagesContent";
import { useState } from "react";
import { MessagesList } from "./messages/conversation/MessagesList";
import { useMessages } from "@/hooks/useMessages";
import { toast } from "sonner";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const queryClient = new QueryClient();

const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

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
  const navigate = useNavigate();

  const handleBack = () => {
    setShowConversation(false);
    setSelectedReceiver(null);
    navigate('/dashboard/messages');
  };

  const handleSelectConversation = async (type: "assistant" | "user", receiver?: any) => {
    try {
      if (type === "assistant") {
        setSelectedReceiver(null);
        setShowConversation(true);
      } else if (type === "user" && receiver) {
        // Mark all unread messages from this sender as read
        const unreadMessages = messages.filter(
          m => m.sender.id === receiver.id && !m.read
        );
        
        for (const message of unreadMessages) {
          await markAsRead.mutateAsync(message.id);
        }

        setSelectedReceiver(receiver);
        setShowConversation(true);
        navigate(`/dashboard/messages/${receiver.id}`);
      }
    } catch (error) {
      console.error("Error selecting conversation:", error);
      toast.error("Erreur lors de la sélection de la conversation");
    }
  };

  // Determine which messages to show based on conversation type
  const displayMessages = selectedReceiver ? messages : chatMessages;

  return showConversation ? (
    <MessagesContent
      messages={displayMessages}
      inputMessage={inputMessage}
      isListening={isListening}
      isThinking={isThinking}
      onSendMessage={handleSendMessage}
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
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReceiverFromUrl = async () => {
      const path = location.pathname;
      const match = path.match(/\/messages\/([^\/]+)/);
      
      if (match && match[1]) {
        const receiverId = match[1];
        
        // Validate UUID before making the query
        if (!isValidUUID(receiverId)) {
          console.error("Invalid UUID format:", receiverId);
          setShowConversation(false);
          setSelectedReceiver(null);
          navigate('/dashboard/messages');
          return;
        }

        try {
          const { data: receiver, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', receiverId)
            .maybeSingle();

          if (error) throw error;

          if (receiver) {
            setSelectedReceiver(receiver);
            setShowConversation(true);
          } else {
            // Handle case where receiver is not found
            toast.error("Utilisateur non trouvé");
            navigate('/dashboard/messages');
          }
        } catch (error) {
          console.error("Error fetching receiver:", error);
          toast.error("Erreur lors de la récupération du profil");
          navigate('/dashboard/messages');
        }
      } else {
        // If no receiver ID in URL, show the messages list
        setShowConversation(false);
        setSelectedReceiver(null);
      }
    };

    fetchReceiverFromUrl();
  }, [location.pathname]);

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