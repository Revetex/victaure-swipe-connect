import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { AnimatePresence } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";

interface MessagesContentProps {
  messages: any[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  onSendMessage: (message: string) => void;
  onVoiceInput: () => void;
  setInputMessage: (message: string) => void;
  onClearChat: () => void;
  onBack: () => void;
  receiver?: {
    full_name?: string;
    avatar_url?: string;
  };
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
  onBack,
  receiver
}: MessagesContentProps) {
  const { profile } = useProfile();

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex flex-col pt-14">
      <ChatHeader
        onBack={onBack}
        title={receiver?.full_name || "Utilisateur"}
        subtitle="Conversation"
        avatarUrl={receiver?.avatar_url}
        isThinking={isThinking}
      />

      <div className="flex-1 overflow-hidden bg-background/80">
        <ScrollArea className="h-full px-4 py-4">
          <div className="max-w-5xl mx-auto space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  sender={message.sender_id === profile?.id ? "user" : "assistant"}
                  thinking={message.thinking}
                  showTimestamp={true}
                  timestamp={message.created_at}
                />
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>

      <div className="shrink-0 border-t bg-background/95 backdrop-blur-sm p-4 relative z-20">
        <div className="max-w-5xl mx-auto">
          <ChatInput
            value={inputMessage}
            onChange={setInputMessage}
            onSend={() => onSendMessage(inputMessage)}
            onVoiceInput={onVoiceInput}
            isListening={isListening}
            isThinking={isThinking}
            placeholder="Écrivez votre message..."
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}