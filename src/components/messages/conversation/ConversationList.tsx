
import { useAuth } from "@/hooks/useAuth";
import { useReceiver } from "@/hooks/useReceiver";
import { cn } from "@/lib/utils";
import { ConversationItem } from "./components/ConversationItem";
import { ConversationSearch } from "./components/ConversationSearch";
import { NewConversationPopover } from "./components/NewConversationPopover";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
  
  const fetchConversations = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      console.log("Fetching conversations for user:", user.id);
      
      const { data: existingConversations, error } = await supabase
        .from('conversations')
        .select(`
          id,
          participant1_id,
          participant2_id,
          last_message,
          last_message_time,
          participant1:profiles!conversations_participant1_id_fkey (
            id, full_name, avatar_url, online_status, last_seen
          ),
          participant2:profiles!conversations_participant2_id_fkey (
            id, full_name, avatar_url, online_status, last_seen
          )
        `)
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('last_message_time', { ascending: false });

      if (error) {
        console.error("Error fetching conversations:", error);
        toast.error("Erreur lors du chargement des conversations");
        throw error;
      }

      // Transformation des données avec déduplication
      const seenParticipants = new Set<string>();
      const formattedConversations: Conversation[] = [];

      existingConversations?.forEach(conv => {
        const otherParticipantId = conv.participant1_id === user.id ? conv.participant2_id : conv.participant1_id;
        
        if (!seenParticipants.has(otherParticipantId)) {
          seenParticipants.add(otherParticipantId);
          
          const conversation: Conversation = {
            id: conv.id,
            participant1_id: user.id,
            participant2_id: otherParticipantId,
            participant1: Array.isArray(conv.participant1) ? 
              conv.participant1[0] || { ...defaultParticipant, id: conv.participant1_id } :
              conv.participant1 || { ...defaultParticipant, id: conv.participant1_id },
            participant2: Array.isArray(conv.participant2) ? 
              conv.participant2[0] || { ...defaultParticipant, id: conv.participant2_id } :
              conv.participant2 || { ...defaultParticipant, id: conv.participant2_id },
            last_message: conv.last_message,
            last_message_time: conv.last_message_time
          };
          
          formattedConversations.push(conversation);
        }
      });

      setConversations(formattedConversations);
      
    } catch (error) {
      console.error("Error in fetchConversations:", error);
      toast.error("Erreur lors du chargement des conversations");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

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
          const newConversation = payload.new as ConversationPayload;
          if (newConversation?.participant1_id === user.id || newConversation?.participant2_id === user.id) {
            fetchConversations();
          }
        }
      )
      .subscribe();

    fetchConversations();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchConversations]);

  const handleConversationSelect = useCallback((conversation: Conversation) => {
    setSelectedConversationId(conversation.id);
    setReceiver(conversation.participant2 as any);
  }, [setSelectedConversationId, setReceiver]);

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
