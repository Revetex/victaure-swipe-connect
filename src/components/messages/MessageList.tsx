import { Message, Receiver } from "@/types/messages";
import { MessagesContent } from "./MessagesContent";
import { ConversationList } from "./conversation/ConversationList";

interface MessageListProps {
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
  messages: Message[];
  markAsRead: any;
  navigate: (path: string) => void;
}

export function MessageList({
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
  setSelectedReceiver,
  messages,
  markAsRead,
  navigate,
}: MessageListProps) {
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
      } else if (type === "user" && receiver) {
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

  const formattedChatMessages = formatChatMessages(chatMessages);
  const currentMessages = selectedReceiver?.id === 'assistant' ? formattedChatMessages : messages;
  const filteredMessages = filterMessages(currentMessages, selectedReceiver);

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
      messages={messages}
      chatMessages={formattedChatMessages}
      onSelectConversation={handleSelectConversation}
    />
  );
}