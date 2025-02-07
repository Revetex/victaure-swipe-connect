
import { MessagesContent } from "./MessagesContent";
import { ConversationList } from "./conversation/ConversationList";
import { useReceiver } from "@/hooks/useReceiver";
import { useAIChat } from "@/hooks/useAIChat";
import { useUserChat } from "@/hooks/useUserChat";
import { toast } from "sonner";
import { useMessageCleanup } from "@/hooks/useMessageCleanup";
import { useConversationHandler } from "@/hooks/useConversationHandler";
import { useConversationDelete } from "@/hooks/useConversationDelete";
import { useMessageReadStatus } from "@/hooks/useMessageReadStatus";
import { useProfile } from "@/hooks/useProfile";

export function MessagesWrapper() {
  const { showConversation, receiver } = useReceiver();
  const { profile } = useProfile();
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
      if (receiver.id === 'assistant') {
        await handleAISendMessage(message);
      } else {
        await handleUserSendMessage(message, receiver);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    }
  };

  if (showConversation && receiver) {
    const currentMessages = receiver.id === 'assistant' ? aiMessages : userMessages;
    const currentInputMessage = receiver.id === 'assistant' ? aiInputMessage : userInputMessage;
    const setCurrentInputMessage = receiver.id === 'assistant' ? setAIInputMessage : setUserInputMessage;

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
        <MessagesContent
          messages={currentMessages}
          inputMessage={currentInputMessage}
          isThinking={isThinking}
          isListening={isListening}
          onSendMessage={handleSendMessage}
          setInputMessage={setCurrentInputMessage}
          onBack={handleBack}
          receiver={receiver}
          onClearChat={() => handleDeleteConversation(receiver)}
          messagesEndRef={null}
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
