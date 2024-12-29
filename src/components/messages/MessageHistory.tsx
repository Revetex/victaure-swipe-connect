import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MessageItem } from "./MessageItem";

interface MessageHistoryProps {
  onSelectConversation: (messageId: string) => void;
}

export function MessageHistory({ onSelectConversation }: MessageHistoryProps) {
  const { data: messages, isLoading } = useQuery({
    queryKey: ['message-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender:sender_id(id, full_name, avatar_url),
          receiver:receiver_id(id, full_name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Grouper les messages par date
  const groupedMessages = messages?.reduce((groups: any, message: any) => {
    const date = format(new Date(message.created_at), 'dd MMMM yyyy', { locale: fr });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-6">
        {Object.entries(groupedMessages || {}).map(([date, messages]: [string, any]) => (
          <div key={date} className="space-y-2">
            <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-2">
              <h3 className="text-sm font-medium text-muted-foreground">{date}</h3>
            </div>
            <div className="space-y-2">
              {messages.map((message: any) => (
                <MessageItem
                  key={message.id}
                  {...message}
                  onClick={() => onSelectConversation(message.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}