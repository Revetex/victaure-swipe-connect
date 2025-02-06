import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ConversationListProps {
  onSelectConversation: (receiver: any) => void;
}

export function ConversationList({ onSelectConversation }: ConversationListProps) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { profile } = useProfile();

  useEffect(() => {
    fetchConversations();
  }, [profile]);

  const fetchConversations = async () => {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*),
          receiver:profiles!messages_receiver_id_fkey(*)
        `)
        .or(`sender_id.eq.${profile?.id},receiver_id.eq.${profile?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation
      const conversationsMap = new Map();
      messages?.forEach(message => {
        const otherUser = message.sender_id === profile?.id ? message.receiver : message.sender;
        if (!conversationsMap.has(otherUser.id)) {
          conversationsMap.set(otherUser.id, {
            user: otherUser,
            lastMessage: message
          });
        }
      });

      setConversations(Array.from(conversationsMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error("Erreur lors du chargement des conversations");
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 h-auto p-4"
              onClick={() => onSelectConversation({
                id: 'assistant',
                full_name: 'M. Victaure',
                avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
                online_status: true,
                last_seen: new Date().toISOString()
              })}
            >
              <Bot className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-medium">M. Victaure</h3>
                <p className="text-sm text-muted-foreground">Assistant virtuel</p>
              </div>
            </Button>
          </motion.div>

          {filteredConversations.map((conv) => (
            <motion.div
              key={conv.user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                className="w-full flex items-center gap-2 h-auto p-4"
                onClick={() => onSelectConversation(conv.user)}
              >
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{conv.user.full_name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {new Date(conv.lastMessage.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.lastMessage.content}
                  </p>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}