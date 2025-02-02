import { useChat } from "@/hooks/useChat";
import { useMessages } from "@/hooks/useMessages";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useReceiver } from "@/hooks/useReceiver";
import { MessageList } from "./messages/MessageList";
import { Message } from "@/types/messages";
import { formatChatMessages } from "@/utils/messageUtils";

const queryClient = new QueryClient();

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

  const { messages, markAsRead } = useMessages();
  const navigate = useNavigate();

  const { 
    receiver: selectedReceiver, 
    setReceiver: setSelectedReceiver,
    showConversation,
    setShowConversation
  } = useReceiver();

  // Filter out self-conversations before passing to MessageList
  const filteredMessages = messages?.filter(message => 
    message.sender_id !== message.receiver_id
  ) || [];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-full flex flex-col">
        <MessageList
          chatMessages={formatChatMessages(chatMessages)}
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
          messages={filteredMessages}
          markAsRead={markAsRead}
          navigate={navigate}
        />
      </div>
    </QueryClientProvider>
  );
}