import { useChat } from "@/hooks/useChat";
import { MessagesContent } from "./messages/MessagesContent";

export function Messages() {
  const {
    messages,
    inputMessage,
    isListening,
    isThinking,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    clearChat
  } = useChat();

  return (
    <div className="h-full flex flex-col">
      <MessagesContent
        messages={messages}
        inputMessage={inputMessage}
        isListening={isListening}
        isThinking={isThinking}
        onSendMessage={handleSendMessage}
        onVoiceInput={handleVoiceInput}
        setInputMessage={setInputMessage}
        onClearChat={clearChat}
      />
    </div>
  );
}