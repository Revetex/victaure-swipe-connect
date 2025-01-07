import { ChatMessage } from '@/types/chat/messageTypes';

interface MessagesContentProps {
  messages: ChatMessage[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  onSendMessage: (message: string) => void;
  onVoiceInput: () => void;
  setInputMessage: (message: string) => void;
  onClearChat: () => void;
  onBack: () => void;
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
  onBack
}: MessagesContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Implementation */}
    </div>
  );
}