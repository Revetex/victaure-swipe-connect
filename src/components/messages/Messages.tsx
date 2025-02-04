import { useChat } from "@/hooks/useChat";
import { useReceiver } from "@/hooks/useReceiver";
import { MessagesWrapper } from "./MessagesWrapper";
import { formatChatMessages, filterMessages } from "@/utils/messageUtils";

export function Messages() {
  const {
    messages: chatMessages = [],
    inputMessage = "",
    isListening = false,
    isThinking = false,
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

  const formattedChatMessages = formatChatMessages(chatMessages || []);
  const currentMessages = selectedReceiver?.id === 'assistant' ? formattedChatMessages : [];
  const filteredMessages = filterMessages(currentMessages || [], selectedReceiver);

  return (
    <MessagesWrapper
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
  );
}