
import React, { useState, useEffect } from "react";
import { useReceiver } from "@/hooks/useReceiver";
import { Card } from "@/components/ui/card";
import { ConversationView } from "./conversation/ConversationView";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion } from "framer-motion";
import { CustomConversationList } from "./CustomConversationList";
import { Conversation, Receiver } from "@/types/messages";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function MessagesContainer() {
  const { receiver, showConversation, setReceiver } = useReceiver();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Chargement des conversations
  useEffect(() => {
    if (!user) return;
    
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        // Récupérer toutes les conversations de l'utilisateur
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
          .order('updated_at', { ascending: false });
        
        if (error) {
          toast.error("Erreur lors du chargement des conversations");
          return;
        }
        
        if (!data || data.length === 0) {
          setConversations([]);
          return;
        }
        
        // Traiter chaque conversation pour obtenir les détails du participant
        const processedConversations = await Promise.all(
          data.map(async (conv) => {
            const isParticipant1 = conv.participant1_id === user.id;
            const participantId = isParticipant1 ? conv.participant2_id : conv.participant1_id;
            
            // Récupérer les informations du profil de l'autre participant
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', participantId)
              .single();
            
            return {
              ...conv,
              participant: profileData ? {
                id: profileData.id,
                full_name: profileData.full_name || 'Unknown',
                avatar_url: profileData.avatar_url,
                online_status: !!profileData.online_status,
                role: profileData.role || 'professional',
                username: profileData.username || profileData.full_name || '',
              } as Receiver : undefined
            } as Conversation;
          })
        );
        
        setConversations(processedConversations);
      } catch (err) {
        console.error('Error processing conversations:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversations();
    
    // Souscription aux nouvelles conversations
    const channel = supabase
      .channel('conversations_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'conversations' },
        payload => {
          // Actualiser les conversations lors d'un changement
          fetchConversations();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Sélection d'une conversation
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversationId(conversation.id);
    if (conversation.participant) {
      setReceiver(conversation.participant);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "fixed inset-0 top-16 flex h-[calc(100vh-4rem)] w-full",
        "border-0 rounded-none overflow-hidden"
      )}>
        <div className={cn(
          "transition-all duration-300 ease-in-out",
          "border-r border-slate-200/70 bg-muted/5",
          showConversation ? "hidden md:block md:w-80 lg:w-96" : "w-full md:w-80 lg:w-96"
        )}>
          <CustomConversationList 
            conversations={conversations}
            searchQuery={searchQuery}
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            isLoading={isLoading}
          />
        </div>
        
        {(showConversation || receiver) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            {receiver && (
              <ConversationView 
                onBack={() => setSelectedConversationId(null)}
              />
            )}
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
