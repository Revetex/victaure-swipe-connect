import { MessageSquare } from "lucide-react";
import { MessageList } from "../MessageList";
import { useMessages } from "@/hooks/useMessages";

export function MessagesTab() {
  const { messages: userMessages, isLoading, markAsRead } = useMessages();
  
  return (
    <div className="space-y-4">
      {/* User Messages Section */}
      <div>
        <div className="flex items-center gap-2 text-primary mb-4">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <MessageList
          messages={userMessages}
          isLoading={isLoading}
          onMarkAsRead={(messageId) => markAsRead.mutate(messageId)}
        />
      </div>
    </div>
  );
}