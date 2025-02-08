
import { useState } from "react";
import { MessagesContent } from "../MessagesContent";
import { useReceiver } from "@/hooks/useReceiver";
import { useAIChat } from "@/hooks/useAIChat";
import { useUserChat } from "@/hooks/useUserChat";

export function MessagesTab() {
  const { receiver } = useReceiver();
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
    if (inputMessage.trim()) {
      if (receiver && receiver.id === 'assistant') {
        handleAISendMessage(inputMessage);
      } else if (receiver) {
        handleUserSendMessage(inputMessage, receiver);
      }
      setInputMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <MessagesContent
        messages={receiver && receiver.id === 'assistant' ? aiMessages : userMessages}
        inputMessage={inputMessage}
        isThinking={isThinking}
        onSendMessage={handleSendWrapper}
        setInputMessage={handleInputChange}
        onClearChat={receiver?.id === 'assistant' ? clearAIChat : clearUserChat}
        receiver={receiver}
      />
    </div>
  );
}
