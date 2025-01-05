import { Message } from "@/types/chat/messageTypes";
import { ConversationView } from "./conversation/ConversationView";
import { useProfile } from "@/hooks/useProfile";

interface MessagesContentProps {
  messages: Message[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  onSendMessage: (message: string) => void;
  onVoiceInput: () => void;
  setInputMessage: (message: string) => void;
  onClearChat: () => void;
}

export function MessagesContent({
  messages,
  inputMessage,
  isListening,
  isThinking,
  onSendMessage,
  onVoiceInput,
  setInputMessage,
  onClearChat,
}: MessagesContentProps) {
  const { profile } = useProfile();

  return (
    <ConversationView
      messages={messages}
      inputMessage={inputMessage}
      isListening={isListening}
      isThinking={isThinking}
      profile={profile}
      onSendMessage={onSendMessage}
      onVoiceInput={onVoiceInput}
      setInputMessage={setInputMessage}
      onClearChat={onClearChat}
    />
  );
}