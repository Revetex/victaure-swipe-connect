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

  const handleBack = () => {
    // Pour l'instant, on ne fait que rafraîchir la page
    // car nous n'avons pas de gestion d'état pour la navigation
    window.location.href = "/dashboard";
  };

  return (
    <div className="h-full">
      <ConversationView
        messages={messages}
        inputMessage={inputMessage}
        isListening={isListening}
        isThinking={isThinking}
        profile={profile}
        onBack={handleBack}
        onSendMessage={onSendMessage}
        onVoiceInput={onVoiceInput}
        setInputMessage={setInputMessage}
        onClearChat={onClearChat}
      />
    </div>
  );
}