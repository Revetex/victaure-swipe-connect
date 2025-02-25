
import { useAuth } from "@/hooks/useAuth";
import { useReceiver } from "@/hooks/useReceiver";
import { cn } from "@/lib/utils";
import { ConversationItem } from "./components/ConversationItem";
import { ConversationSearch } from "./components/ConversationSearch";
import { NewConversationPopover } from "./components/NewConversationPopover";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export function ConversationList({ className }: { className?: string }) {
  const { user } = useAuth();
  const { setSelectedConversationId } = useReceiver();
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState([]);
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
            participant1:profiles!conversations_participant1_id_fkey(*),
            participant2:profiles!conversations_participant2_id_fkey(*)
          `)
          .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
          .order('last_message_time', { ascending: false });

        if (error) throw error;
        
        // Filtrer par le terme de recherche si nécessaire
        const filteredConversations = existingConversations.filter(conv => {
          const otherParticipant = conv.participant1_id === user.id
            ? conv.participant2
            : conv.participant1;

          return otherParticipant.full_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        });

        setConversations(filteredConversations);
      } catch (error) {
        console.error("Erreur lors du chargement des conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    // Configuration de la souscription en temps réel
    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `participant1_id=eq.${user.id},participant2_id=eq.${user.id}`
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    fetchConversations();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, searchTerm]);

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
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-[#F2EBE4]/60">
            <p>Aucune conversation</p>
            <p className="text-sm">Commencez une nouvelle conversation</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              currentUserId={user?.id}
              isSelected={selectedConversationId === conversation.id}
              onClick={() => setSelectedConversationId(conversation.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
