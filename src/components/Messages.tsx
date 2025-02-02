import { useChat } from "@/hooks/useChat";
import { MessagesContent } from "./messages/MessagesContent";
import { ConversationList } from "./messages/conversation/ConversationList";
import { useMessages } from "@/hooks/useMessages";
import { toast } from "sonner";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useReceiver } from "@/hooks/useReceiver";
import { Message, Receiver, MessageSender } from "@/types/messages";
import { formatChatMessages, filterMessages } from "@/utils/messageUtils";

const queryClient = new QueryClient();

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
  chatMessages: Message[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  showConversation: boolean;
  setShowConversation: (show: boolean) => void;
  handleSendMessage: (message: string) => Promise<void>;
  handleVoiceInput: () => void;
  setInputMessage: (message: string) => void;
  clearChat: () => void;
  selectedReceiver: Receiver | null;
  setSelectedReceiver: (receiver: Receiver | null) => void;
}) {
  const { messages, markAsRead } = useMessages();
  const navigate = useNavigate();

  const handleBack = () => {
    setShowConversation(false);
    setSelectedReceiver(null);
    navigate('/dashboard/messages');
  };

  const handleSelectConversation = async (type: "assistant" | "user", receiver?: Receiver) => {
    try {
      if (type === "assistant") {
        const assistantReceiver: Receiver = {
          id: 'assistant',
          full_name: 'M. Victaure',
          avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
          online_status: true,
          last_seen: new Date().toISOString()
        };
        setSelectedReceiver(assistantReceiver);
        setShowConversation(true);
      } else if (type === "user" && receiver && receiver.id) {
        const unreadMessages = messages.filter(
          m => m.sender?.id === receiver.id && !m.read
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

  const handleClearConversation = () => {
    try {
      clearChat();
      toast.success("Conversation effacée avec succès");
    } catch (error) {
      console.error("Error clearing conversation:", error);
      toast.error("Erreur lors de l'effacement de la conversation");
    }
  };

  const formattedMessages = messages?.map(msg => ({
    ...msg,
    sender: msg.sender || {
      id: msg.sender_id,
      full_name: "Unknown",
      avatar_url: "",
      online_status: false,
      last_seen: new Date().toISOString()
    } as MessageSender
  })) as Message[];

  const formattedChatMessages = formatChatMessages(chatMessages).map(msg => ({
    ...msg,
    sender: typeof msg.sender === 'string' ? {
      id: msg.sender,
      full_name: msg.sender === 'assistant' ? 'M. Victaure' : 'You',
      avatar_url: msg.sender === 'assistant' ? '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png' : '',
      online_status: msg.sender === 'assistant',
      last_seen: new Date().toISOString()
    } as MessageSender : msg.sender,
    sender_id: msg.sender_id || (typeof msg.sender === 'string' ? msg.sender : msg.sender.id),
    receiver_id: selectedReceiver?.id || 'assistant'
  })) as Message[];

  const currentMessages = selectedReceiver?.id === 'assistant' ? formattedChatMessages : formattedMessages;
  const filteredMessages = filterMessages(currentMessages || [], selectedReceiver);

  return showConversation ? (
    <MessagesContent
      messages={filteredMessages}
      inputMessage={inputMessage}
      isListening={isListening}
      isThinking={isThinking}
      onSendMessage={handleSendMessage}
      onVoiceInput={handleVoiceInput}
      setInputMessage={setInputMessage}
      onClearChat={handleClearConversation}
      onBack={handleBack}
      receiver={selectedReceiver}
    />
  ) : (
    <ConversationList
      messages={formattedMessages || []}
      chatMessages={formattedChatMessages}
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

  const { 
    receiver: selectedReceiver, 
    setReceiver: setSelectedReceiver,
    showConversation,
    setShowConversation
  } = useReceiver();

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