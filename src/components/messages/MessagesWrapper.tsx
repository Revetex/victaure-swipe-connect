import { Message, Receiver } from "@/types/messages";
import { MessagesContent } from "./MessagesContent";
import { MessagesList } from "./conversation/MessagesList";
import { useMessages } from "@/hooks/useMessages";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface MessagesWrapperProps {
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
}

export function MessagesWrapper({
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
}: MessagesWrapperProps) {
  const { messages = [], markAsRead } = useMessages();
  const navigate = useNavigate();
  const { user } = useAuth();

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
          avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
          online_status: true,
          last_seen: new Date().toISOString()
        });
        setShowConversation(true);
      } else if (type === "user" && receiver) {
        // Prevent self-conversation
        if (receiver.id === user?.id) {
          toast.error("Vous ne pouvez pas démarrer une conversation avec vous-même");
          return;
        }

        const unreadMessages = messages.filter(
          m => {
            const senderId = typeof m.sender === 'string' ? m.sender : m.sender.id;
            return senderId === receiver.id && !m.read;
          }
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
      console.error("Error clearing chat:", error);
      toast.error("Erreur lors de l'effacement de la conversation");
    }
  };

  return (
    <div className="h-[calc(100dvh-4rem)] flex flex-col overflow-hidden bg-background">
      {showConversation ? (
        <MessagesContent
          messages={messages}
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
        <MessagesList
          messages={messages}
          chatMessages={chatMessages}
          onSelectConversation={handleSelectConversation}
        />
      )}
    </div>
  );
}