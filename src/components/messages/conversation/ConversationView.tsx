
import { Message, Receiver } from "@/types/messages";
import { ConversationHeader } from "./ConversationHeader";
import { ConversationMessages } from "./ConversationMessages";
import { ChatInput } from "./ChatInput";

interface ConversationViewProps {
  messages: Message[];
  receiver: Receiver;
  inputMessage: string;
  isThinking?: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onBack: () => void;
  onDelete: () => Promise<void>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function ConversationView({
  messages,
  receiver,
  inputMessage,
  isThinking,
  onInputChange,
  onSendMessage,
  onBack,
  onDelete,
  messagesEndRef
}: ConversationViewProps) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-none sticky top-0 z-50">
        <ConversationHeader 
          receiver={receiver}
          onBack={onBack}
          onDelete={onDelete}
          className="border-b"
        />
      </div>

      <div className="flex-1 overflow-y-auto relative">
        <ConversationMessages
          messages={messages}
          isThinking={isThinking}
          onReply={onInputChange}
          messagesEndRef={messagesEndRef}
        />
      </div>

      <div className="flex-none fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t z-50">
        <div className="max-w-3xl mx-auto p-4">
          <ChatInput
            value={inputMessage}
            onChange={onInputChange}
            onSend={onSendMessage}
            isThinking={isThinking}
            placeholder="Écrivez votre message..."
          />
        </div>
      </div>
    </div>
  );
}
