import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MessageList } from "./messages/MessageList";
import { useMessages } from "@/hooks/useMessages";

export function Messages() {
  const { messages, isLoading, markAsRead } = useMessages();
  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        {unreadCount > 0 && (
          <Badge variant="secondary" className="bg-primary/10">
            {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
          </Badge>
        )}
      </div>

      <MessageList
        messages={messages}
        isLoading={isLoading}
        onMarkAsRead={(messageId) => markAsRead.mutate(messageId)}
      />
    </div>
  );
}