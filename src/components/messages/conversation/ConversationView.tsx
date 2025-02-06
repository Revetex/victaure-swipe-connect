import { ConversationHeader } from "./ConversationHeader";
import { ConversationContainer } from "./ConversationContainer";
import { ChatInput } from "@/components/chat/ChatInput";
import { Message } from "@/types/messages";
import { UserProfile } from "@/types/profile";

interface ConversationViewProps {
  messages: Message[];
  profile: UserProfile | null;
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isThinking?: boolean;
  isListening?: boolean;
  onVoiceInput?: () => void;
  onBack?: () => void;
  onDeleteConversation?: () => void;
}

export function ConversationView({
  messages,
  profile,
  inputMessage,
  onInputChange,
  onSendMessage,
  isThinking,
  isListening,
  onVoiceInput,
  onBack,
  onDeleteConversation,
}: ConversationViewProps) {
  return (
    <div className="flex flex-col h-full relative">
      <div className="sticky top-0 z-50 shrink-0">
        <ConversationHeader
          profile={profile}
          onBack={onBack}
          onDeleteConversation={onDeleteConversation}
        />
      </div>

      <ConversationContainer 
        messages={messages}
        isThinking={isThinking}
      />

      <div className="sticky bottom-0 shrink-0 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <ChatInput
          value={inputMessage}
          onChange={onInputChange}
          onSend={onSendMessage}
          onVoiceInput={onVoiceInput}
          isListening={isListening}
          isThinking={isThinking}
          placeholder="Écrivez votre message..."
          className="w-full max-w-3xl mx-auto"
        />
      </div>
    </div>
  );
}