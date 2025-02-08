import { useState } from "react";
import { MessagesContent } from "../MessagesContent";
import { useReceiver } from "@/hooks/useReceiver";
import { useAIChat } from "@/hooks/useAIChat";
import { useUserChat } from "@/hooks/useUserChat";
import { Receiver } from "@/types/messages";

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

  const handleSendWrapper = () => {
    if (inputMessage.trim()) {
      if (receiver && receiver.id === 'assistant') {
        handleAISendMessage(inputMessage);
      } else {
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
        setInputMessage={setInputMessage}
        onClearChat={clearAIChat}
        receiver={receiver}
      />
    </div>
  );
}
