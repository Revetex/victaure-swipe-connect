
import { MessagesContent } from "./MessagesContent";
import { ConversationList } from "./conversation/ConversationList";
import { useReceiver } from "@/hooks/useReceiver";
import { useAIChat } from "@/hooks/useAIChat";
import { useUserChat } from "@/hooks/useUserChat";
import { toast } from "sonner";
import { ChatHeader } from "../chat/ChatHeader";
import { useMessageCleanup } from "@/hooks/useMessageCleanup";
import { useConversationHandler } from "@/hooks/useConversationHandler";
import { useConversationDelete } from "@/hooks/useConversationDelete";
import { useMessageReadStatus } from "@/hooks/useMessageReadStatus";

export function MessagesWrapper() {
  const { showConversation, receiver } = useReceiver();
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

  // Utilisation des nouveaux hooks
  useMessageCleanup();
  const { handleBack, handleSelectConversation } = useConversationHandler();
  const { handleDeleteConversation } = useConversationDelete(clearUserChat);
  useMessageReadStatus(showConversation, receiver);

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
          onClearChat={() => handleDeleteConversation(receiver)}
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
