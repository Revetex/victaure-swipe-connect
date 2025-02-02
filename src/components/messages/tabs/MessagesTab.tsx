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
      profile={profile}
      inputMessage={inputMessage}
      isListening={isListening}
      isThinking={isThinking}
      onInputChange={setInputMessage}
      onSendMessage={handleSendMessage}
      onVoiceInput={handleVoiceInput}
      onBack={() => {}}
    />
  );
}