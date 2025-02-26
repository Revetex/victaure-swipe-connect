
import { useAuth } from "@/hooks/useAuth";
import { useReceiver } from "@/hooks/useReceiver";
import { cn } from "@/lib/utils";
import { ConversationItem } from "./components/ConversationItem";
import { ConversationSearch } from "./components/ConversationSearch";
import { NewConversationPopover } from "./components/NewConversationPopover";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import type { UserProfile } from "@/types/profile";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  participant1: Pick<UserProfile, 'id' | 'full_name' | 'avatar_url' | 'online_status' | 'last_seen'>;
  participant2: Pick<UserProfile, 'id' | 'full_name' | 'avatar_url' | 'online_status' | 'last_seen'>;
  last_message?: string;
  last_message_time?: string;
}

interface ConversationPayload {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message?: string;
  last_message_time?: string;
}

const defaultParticipant: Pick<UserProfile, 'id' | 'full_name' | 'avatar_url' | 'online_status' | 'last_seen'> = {
  id: '',
  full_name: '',
  avatar_url: null,
  online_status: false,
  last_seen: new Date().toISOString()
};

export function ConversationList({ className }: { className?: string }) {
  const { user } = useAuth();
  const { setSelectedConversationId, setReceiver } = useReceiver();
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedConversationId = useReceiver().selectedConversationId;
  
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const { data: existingConversations, error } = await supabase
          .from('conversations')
          .select(`
            *,
            participant1:profiles!conversations_participant1_id_fkey(
              id, full_name, avatar_url, online_status, last_seen
            ),
            participant2:profiles!conversations_participant2_id_fkey(
              id, full_name, avatar_url, online_status, last_seen
            )
          `)
          .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
          .order('last_message_time', { ascending: false });

        if (error) throw error;
        
        const formattedConversations: Conversation[] = (existingConversations || []).map(conv => {
          if (conv.participant1_id === user.id) {
            return {
              id: conv.id,
              participant1_id: conv.participant1_id,
              participant2_id: conv.participant2_id,
              participant1: conv.participant1[0] || { ...defaultParticipant, id: conv.participant1_id },
              participant2: conv.participant2[0] || { ...defaultParticipant, id: conv.participant2_id },
              last_message: conv.last_message,
              last_message_time: conv.last_message_time
            };
          }
          return {
            id: conv.id,
            participant1_id: conv.participant2_id,
            participant2_id: conv.participant1_id,
            participant1: conv.participant2[0] || { ...defaultParticipant, id: conv.participant2_id },
            participant2: conv.participant1[0] || { ...defaultParticipant, id: conv.participant1_id },
            last_message: conv.last_message,
            last_message_time: conv.last_message_time
          };
        });
        
        const uniqueConversations = formattedConversations.filter((conv, index, self) =>
          index === self.findIndex((c) => c.participant2_id === conv.participant2_id)
        );
        
        setConversations(uniqueConversations);
      } catch (error) {
        console.error("Error loading conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        (payload: RealtimePostgresChangesPayload<ConversationPayload>) => {
          const newConversation = payload.new;
          if (newConversation && (newConversation.participant1_id === user.id || newConversation.participant2_id === user.id)) {
            fetchConversations();
          }
        }
      )
      .subscribe();

    fetchConversations();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversationId(conversation.id);
    setReceiver(conversation.participant2 as any);
  };

  const filteredConversations = conversations.filter(conv => 
    conv.participant2?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="border-b border-[#64B5D9]/10">
        <div className="flex items-center justify-between p-3 gap-2">
          <ConversationSearch 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm}
          />
          <NewConversationPopover 
            onSelectFriend={() => setSearchTerm("")} 
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-[#64B5D9] animate-spin" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-[#F2EBE4]/60">
            <p>Aucune conversation</p>
            <p className="text-sm">Commencez une nouvelle conversation</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversationId === conversation.id}
              onClick={() => handleConversationSelect(conversation)}
            />
          ))
        )}
      </div>
    </div>
  );
}
