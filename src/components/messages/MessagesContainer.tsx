
import React, { useState, useEffect } from "react";
import { useReceiver } from "@/hooks/useReceiver";
import { Card } from "@/components/ui/card";
import { ConversationView } from "./conversation/ConversationView";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useThemeContext } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import { CustomConversationList } from "./CustomConversationList";
import { Conversation } from "@/types/messages";
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
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            *,
            participant:participant2_id(id, full_name, avatar_url, online_status)
          `)
          .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
          .order('updated_at', { ascending: false });
        
        if (error) throw error;
        
        // Process conversations for the current user
        const processedConversations = data.map(conversation => {
          // Determine if the participant is the current user or the other participant
          const isParticipant1 = conversation.participant1_id === user.id;
          const participantId = isParticipant1 ? conversation.participant2_id : conversation.participant1_id;
          
          // If participant data is available, use it; otherwise, use the built-in participant data
          let participant = conversation.participant;
          
          // If the participant is the user or the participant data doesn't match what we expect
          if (isParticipant1 && participant?.id !== participantId) {
            participant = null; // We'll need to fetch this separately
          }
          
          return {
            ...conversation,
            participant
          };
        });
        
        setConversations(processedConversations);
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
