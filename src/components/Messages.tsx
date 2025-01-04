import { Tabs } from "@/components/ui/tabs";
import { MessagesTabs } from "./messages/MessagesTabs";
import { MessagesContent } from "./messages/MessagesContent";
import { AssistantTab } from "./messages/tabs/AssistantTab";

interface MessagesProps {
  messages: any[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  profile: any;
  onSendMessage: (message: string, profile: any) => void;
  onVoiceInput: () => void;
  setInputMessage: (message: string) => void;
  onClearChat: () => void;
  onRestoreChat: () => void;
}

export function Messages({
  messages,
  inputMessage,
  isListening,
  isThinking,
  profile,
  onSendMessage,
  onVoiceInput,
  setInputMessage,
  onClearChat,
  onRestoreChat
}: MessagesProps) {
  return (
    <Tabs defaultValue="assistant" className="h-full flex flex-col">
      <MessagesTabs />
      <MessagesContent>
        <AssistantTab
          messages={messages}
          inputMessage={inputMessage}
          isListening={isListening}
          isThinking={isThinking}
          profile={profile}
          onSendMessage={onSendMessage}
          onVoiceInput={onVoiceInput}
          setInputMessage={setInputMessage}
          onClearChat={onClearChat}
          onRestoreChat={onRestoreChat}
        />
      </MessagesContent>
    </Tabs>
  );
}