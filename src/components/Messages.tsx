import { useChat } from "@/hooks/useChat";
import { MessagesContent } from "./messages/MessagesContent";
import { MessagesList } from "./messages/conversation/MessagesList";
import { useMessages } from "@/hooks/useMessages";
import { toast } from "sonner";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useReceiver } from "@/hooks/useReceiver";
import { Message, Receiver } from "@/types/messages";
import { Message as ChatMessage } from "@/types/chat/messageTypes";

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
  chatMessages: ChatMessage[];
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
        setSelectedReceiver({
          id: 'assistant',
          full_name: 'M. Victaure',
          avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png'
        });
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

  // Convert chat messages to the Message type format
  const formattedChatMessages: Message[] = chatMessages.map(msg => ({
    id: msg.id,
    content: msg.content,
    sender_id: msg.sender === 'user' ? 'user' : 'assistant',
    receiver_id: msg.sender === 'user' ? 'assistant' : 'user',
    read: true,
    created_at: msg.created_at || new Date().toISOString(),
    thinking: msg.thinking,
    timestamp: msg.timestamp?.toISOString(),
    sender: msg.sender === 'user' ? undefined : {
      id: 'assistant',
      full_name: 'M. Victaure',
      avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png'
    }
  }));

  return showConversation ? (
    <MessagesContent
      messages={selectedReceiver ? messages : formattedChatMessages}
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