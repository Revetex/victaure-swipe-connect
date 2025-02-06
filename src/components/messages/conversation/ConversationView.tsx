
import { Message, Receiver } from "@/types/messages";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatThinking } from "@/components/chat/ChatThinking";

export interface ConversationViewProps {
  messages: Message[];
  receiver: Receiver;
  inputMessage: string;
  isThinking?: boolean;
  isListening?: boolean;
  onInputChange: (message: string) => void;
  onSendMessage: () => void;
  onVoiceInput?: () => void;
  onBack: () => void;
  onDeleteConversation: () => Promise<void>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function ConversationView({
  messages,
  receiver,
  inputMessage,
  isThinking,
  isListening,
  onInputChange,
  onSendMessage,
  onVoiceInput,
  onBack,
  onDeleteConversation,
  messagesEndRef
}: ConversationViewProps) {
  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        title={receiver.full_name}
        subtitle={receiver.id === 'assistant' ? "Assistant virtuel" : "En ligne"}
        avatarUrl={receiver.avatar_url}
        onBack={onBack}
        onDelete={onDeleteConversation}
      />

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              sender={message.sender_id === receiver.id ? "assistant" : "user"}
              timestamp={message.created_at}
              isRead={message.read}
            />
          ))}
          {isThinking && <ChatThinking />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <ChatInput
          value={inputMessage}
          onChange={onInputChange}
          onSend={onSendMessage}
          isThinking={isThinking}
          isListening={isListening}
          onVoiceInput={onVoiceInput}
          placeholder="Écrivez votre message..."
        />
      </div>
    </div>
  );
}
