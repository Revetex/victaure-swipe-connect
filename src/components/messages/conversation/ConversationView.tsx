import { useState } from "react";
import { ConversationHeader } from "./ConversationHeader";
import { MessagesList } from "./MessagesList";
import { ChatInput } from "@/components/chat/ChatInput";
import { Profile } from "@/types/profile";
import { Message } from "@/types/messages";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface ConversationViewProps {
  messages: Message[];
  profile: Profile | null;
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isThinking?: boolean;
  onDeleteConversation?: () => void;
}

export function ConversationView({
  messages,
  profile,
  inputMessage,
  onInputChange,
  onSendMessage,
  isThinking,
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="sticky top-0 z-50 shrink-0">
        <ConversationHeader
          profile={profile}
          onDeleteConversation={onDeleteConversation}
        />
      </div>

      <ScrollArea className="flex-1 px-4">
        <MessagesList messages={messages} />
      </ScrollArea>

      <div className="sticky bottom-16 shrink-0 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <ChatInput
          value={inputMessage}
          onChange={onInputChange}
          onSend={onSendMessage}
          onKeyPress={handleKeyPress}
          onStartListening={startListening}
          onStopListening={stopListening}
          hasRecognitionSupport={hasRecognitionSupport}
          isListening={isListening}
          isThinking={isThinking}
          placeholder="Écrivez votre message..."
          className="w-full max-w-3xl mx-auto"
        />
      </div>
    </div>
  );
}