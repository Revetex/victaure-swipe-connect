import { MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  sender: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  content: string;
  created_at: string;
  read: boolean;
}

export function Messages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          read,
          sender:profiles!messages_sender_id_fkey (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return messages as Message[];
    },
  });

  // Mark message as read
  const markAsRead = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (error) => {
      console.error('Error marking message as read:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de marquer le message comme lu",
      });
    },
  });

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

      <ScrollArea className="h-[300px] pr-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageSquare className="h-8 w-8 mb-2" />
            <p>Aucun message</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-2">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => !message.read && markAsRead.mutate(message.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    !message.read 
                      ? "bg-primary/10 border-l-2 border-primary shadow-sm" 
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={message.sender.avatar_url} alt={message.sender.full_name} />
                      <AvatarFallback>
                        {message.sender.full_name?.slice(0, 2).toUpperCase() || "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-medium truncate">{message.sender.full_name}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(message.created_at), { 
                            addSuffix: true,
                            locale: fr 
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </ScrollArea>
    </div>
  );
}