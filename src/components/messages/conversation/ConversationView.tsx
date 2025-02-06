import { ConversationHeader } from "./ConversationHeader";
import { MessagesList } from "./MessagesList";
import { ChatInput } from "@/components/chat/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
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
  onBack,
  onDeleteConversation,
}: ConversationViewProps) {
  const {
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport
  } = useSpeechRecognition({
    onResult: (transcript) => {
      onInputChange(inputMessage + transcript);
    },
  });

  return (
    <div className="flex flex-col h-full relative">
      <div className="sticky top-0 z-50 shrink-0">
        <ConversationHeader
          profile={profile}
          onBack={onBack}
          onDeleteConversation={onDeleteConversation}
        />
      </div>

      <ScrollArea className="flex-1 px-4">
        <MessagesList 
          messages={messages}
          chatMessages={[]}
          onSelectConversation={() => {}}
        />
      </ScrollArea>

      <div className="sticky bottom-16 shrink-0 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <ChatInput
          value={inputMessage}
          onChange={onInputChange}
          onSend={onSendMessage}
          onVoiceInput={hasRecognitionSupport ? (isListening ? stopListening : startListening) : undefined}
          isListening={isListening}
          isThinking={isThinking}
          placeholder="Écrivez votre message..."
          className="w-full max-w-3xl mx-auto"
        />
      </div>
    </div>
  );
}