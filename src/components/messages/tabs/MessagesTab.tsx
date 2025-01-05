import { useMessages } from "@/hooks/useMessages";
import { useChat } from "@/hooks/useChat";
import { ConversationView } from "../conversation/ConversationView";
import { useProfile } from "@/hooks/useProfile";

export function MessagesTab() {
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
  const { profile } = useProfile();

  return (
    <ConversationView 
      messages={chatMessages || []}
      inputMessage={inputMessage}
      isListening={isListening}
      isThinking={isThinking}
      profile={profile}
      onSendMessage={handleSendMessage}
      onVoiceInput={handleVoiceInput}
      setInputMessage={setInputMessage}
      onClearChat={clearChat}
    />
  );
}