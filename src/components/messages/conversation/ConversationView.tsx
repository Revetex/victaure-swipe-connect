
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
    <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-background to-muted/20">
      <div className="flex-none sticky top-0 z-50">
        <ConversationHeader 
          receiver={receiver}
          onBack={onBack}
          onDelete={onDelete}
          className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <ConversationMessages
          messages={messages}
          isThinking={isThinking}
          onReply={onInputChange}
          messagesEndRef={messagesEndRef}
        />
      </div>

      <div className="flex-none sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <div className="p-4 max-w-3xl mx-auto">
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
