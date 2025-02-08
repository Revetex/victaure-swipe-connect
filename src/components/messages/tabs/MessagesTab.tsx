
import { useState } from "react";
import { MessagesContent } from "../MessagesContent";
import { useReceiver } from "@/hooks/useReceiver";
import { useAIChat } from "@/hooks/useAIChat";
import { useUserChat } from "@/hooks/useUserChat";
import { useMessageReadStatus } from "@/hooks/useMessageReadStatus";
import { toast } from "sonner";

export function MessagesTab() {
  const { receiver } = useReceiver();
  const [showConversation, setShowConversation] = useState(true);

  const {
    messages: aiMessages,
    inputMessage: aiInputMessage,
    isThinking,
    handleSendMessage: handleAISendMessage,
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

  useMessageReadStatus(showConversation, receiver);

  const [inputMessage, setInputMessage] = useState("");

  const handleInputChange = (value: string) => {
    setInputMessage(value);
    if (receiver?.id === 'assistant') {
      setAIInputMessage(value);
    } else {
      setUserInputMessage(value);
    }
  };

  const handleSendWrapper = () => {
    if (!receiver) {
      toast.error("Sélectionnez un destinataire pour envoyer un message");
      return;
    }

    if (!inputMessage.trim()) {
      toast.error("Le message ne peut pas être vide");
      return;
    }

    try {
      if (receiver.id === 'assistant') {
        handleAISendMessage(inputMessage);
      } else {
        handleUserSendMessage(inputMessage, receiver);
      }
      setInputMessage("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Erreur lors de l'envoi du message");
    }
  };

  const handleClearChat = async () => {
    if (!receiver) return;
    
    try {
      if (receiver.id === 'assistant') {
        await clearAIChat();
      } else {
        await clearUserChat(receiver.id);
      }
      toast.success("Conversation effacée");
    } catch (error) {
      console.error("Erreur lors de l'effacement de la conversation:", error);
      toast.error("Erreur lors de l'effacement de la conversation");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <MessagesContent
        messages={receiver?.id === 'assistant' ? aiMessages : userMessages}
        inputMessage={inputMessage}
        isThinking={isThinking}
        onSendMessage={handleSendWrapper}
        setInputMessage={handleInputChange}
        onClearChat={handleClearChat}
        receiver={receiver}
      />
    </div>
  );
}
