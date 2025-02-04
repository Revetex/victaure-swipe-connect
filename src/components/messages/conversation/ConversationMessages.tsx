import { Message } from "@/types/messages";
import { UserMessage } from "./UserMessage";
import { AssistantMessage } from "./AssistantMessage";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";

interface ConversationMessagesProps {
  messages: Message[];
  isThinking?: boolean;
  showScrollButton: boolean;
  onScroll: () => void;
  onScrollToBottom: () => void;
}

export function ConversationMessages({
  messages,
  isThinking,
  showScrollButton,
  onScroll,
  onScrollToBottom
}: ConversationMessagesProps) {
  const { user } = useAuth();
  const { deleteMessage } = useMessages();

  const handleDelete = async (messageId: string) => {
    await deleteMessage.mutateAsync(messageId);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" onScroll={onScroll}>
      {messages.map((message) => {
        const isUserMessage = typeof message.sender === 'string' 
          ? message.sender_id === user?.id 
          : message.sender.id === user?.id;

        return isUserMessage ? (
          <UserMessage 
            key={message.id} 
            message={message} 
            onDelete={() => handleDelete(message.id)}
          />
        ) : (
          <AssistantMessage 
            key={message.id} 
            message={message} 
          />
        );
      })}
      {isThinking && (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
        </div>
      )}
      {showScrollButton && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-24 right-8 rounded-full shadow-lg"
          onClick={onScrollToBottom}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}