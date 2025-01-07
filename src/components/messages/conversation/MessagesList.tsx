import { Message } from '@/types/chat/messageTypes';

interface MessagesListProps {
  messages: Message[];
  chatMessages: any[];
  onSelectConversation: (type: "assistant") => void;
  onMarkAsRead: (messageId: string) => void;
}

export function MessagesList({
  messages,
  chatMessages,
  onSelectConversation,
  onMarkAsRead
}: MessagesListProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Implementation */}
    </div>
  );
}