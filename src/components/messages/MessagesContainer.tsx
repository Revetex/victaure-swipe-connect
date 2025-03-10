
import React, { useState, useEffect } from "react";
import { useReceiver } from "@/hooks/useReceiver";
import { Card } from "@/components/ui/card";
import { ConversationView } from "./conversation/ConversationView";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useThemeContext } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import { CustomConversationList } from "./CustomConversationList";
import { Conversation, Receiver } from "@/types/messages";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function MessagesContainer() {
  const { receiver, showConversation, setReceiver } = useReceiver();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isDark } = useThemeContext();
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch conversations
  useEffect(() => {
    if (!user) return;
    
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        // First get all conversations for the current user
        const { data: conversationsData, error: conversationsError } = await supabase
          .from('conversations')
          .select('*')
          .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
          .order('updated_at', { ascending: false });
        
        if (conversationsError) throw conversationsError;
        
        if (!conversationsData) {
          setConversations([]);
          setIsLoading(false);
          return;
        }
        
        // Process each conversation to fetch the participant's details
        const processedConversations = await Promise.all(
          conversationsData.map(async (conversation) => {
            // Determine if the participant is the current user or the other participant
            const isParticipant1 = conversation.participant1_id === user.id;
            const participantId = isParticipant1 ? conversation.participant2_id : conversation.participant1_id;
            
            // Fetch the participant's profile
            const { data: participantData, error: participantError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', participantId)
              .single();
            
            if (participantError) {
              console.error('Error fetching participant:', participantError);
              // Return conversation with default participant
              return {
                ...conversation,
                participant: {
                  id: participantId,
                  full_name: 'Unknown',
                  avatar_url: null,
                  online_status: false
                } as Receiver
              };
            }
            
            // Return the conversation with the participant data
            return {
              ...conversation,
              participant: {
                id: participantData.id,
                full_name: participantData.full_name || 'Unknown',
                avatar_url: participantData.avatar_url,
                online_status: participantData.online_status || false,
                last_seen: participantData.last_seen,
                username: participantData.username || '',
                phone: participantData.phone || null,
                city: participantData.city || null,
                state: participantData.state || null,
                country: participantData.country || null
              } as Receiver
            };
          })
        );
        
        setConversations(processedConversations as Conversation[]);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversations();
    
    // Subscribe to new conversations
    const conversationsSubscription = supabase
      .channel('public:conversations')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'conversations', filter: `participant1_id=eq.${user.id}` },
        payload => {
          setConversations(prev => [payload.new as Conversation, ...prev]);
        }
      )
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'conversations', filter: `participant2_id=eq.${user.id}` },
        payload => {
          setConversations(prev => [payload.new as Conversation, ...prev]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(conversationsSubscription);
    };
  }, [user]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversationId(conversation.id);
    // Also set the receiver for the conversation view
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
        "border-0 rounded-none overflow-hidden",
        isDark 
          ? "bg-background border-border" 
          : "bg-background border-slate-200"
      )}>
        <div className={cn(
          "transition-all duration-300 ease-in-out",
          isDark 
            ? "border-r border-border/10 bg-muted/10" 
            : "border-r border-slate-200/70 bg-muted/5",
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
            className={cn(
              "flex-1 flex flex-col h-full overflow-hidden",
              "transition-all duration-300"
            )}
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
