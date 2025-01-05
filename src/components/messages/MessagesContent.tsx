import { ConversationView } from "./conversation/ConversationView";
import { useProfile } from "@/hooks/useProfile";

interface MessagesContentProps {
  messages: any[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  onSendMessage: (message: string, profile: any) => void;
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
  onClearChat
}: MessagesContentProps) {
  const { profile } = useProfile();

  return (
    <div className="h-full">
      <ConversationView
        messages={messages}
        inputMessage={inputMessage}
        isListening={isListening}
        isThinking={isThinking}
        profile={profile}
        onBack={() => {}}
        onSendMessage={onSendMessage}
        onVoiceInput={onVoiceInput}
        setInputMessage={setInputMessage}
        onClearChat={onClearChat}
      />
    </div>
  );
}