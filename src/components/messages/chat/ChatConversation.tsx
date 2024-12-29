import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { format, isToday, isYesterday } from "date-fns";
import { fr } from "date-fns/locale";

interface ChatConversationProps {
  messagesByDate: Record<string, any[]>;
  currentUser: any;
  isThinking: boolean;
}

export function ChatConversation({ messagesByDate, currentUser, isThinking }: ChatConversationProps) {
  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return "Aujourd'hui";
    } else if (isYesterday(date)) {
      return "Hier";
    }
    return format(date, 'd MMMM yyyy', { locale: fr });
  };

  return (
    <ScrollArea className="flex-1 px-4 py-6">
      <div className="space-y-8 max-w-3xl mx-auto">
        {Object.entries(messagesByDate).map(([dateStr, messages]) => (
          <div key={dateStr} className="space-y-6">
            <div className="sticky top-0 z-10 flex justify-center">
              <span className="text-xs font-medium text-muted-foreground bg-background/95 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                {formatDateHeader(dateStr)}
              </span>
            </div>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                content={message.content}
                sender={message.sender}
                timestamp={new Date(message.created_at)}
                isCurrentUser={message.sender.id === currentUser?.id}
              />
            ))}
          </div>
        ))}
        {isThinking && (
          <ChatBubble
            content="En train d'écrire..."
            sender={{
              id: 'assistant',
              full_name: 'Mr Victaure',
              avatar_url: '/bot-avatar.png'
            }}
            timestamp={new Date()}
            isCurrentUser={false}
          />
        )}
      </div>
    </ScrollArea>
  );
}