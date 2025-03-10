import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useReceiver } from "@/hooks/useReceiver";
import { useAuth } from "@/hooks/useAuth";
import { Search, Plus, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFriendsList } from "@/components/messages/conversation/hooks/useFriendsList";
import { useConversations } from "@/components/messages/conversation/hooks/useConversations";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useThemeContext } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import { CustomConversationItem } from "./CustomConversationItem";
import { CustomNewConversationDialog } from "./CustomNewConversationDialog";
import { Conversation, Receiver } from "@/types/messages";
import { convertToBoolean, safeToLowerCase, safeToNumber } from "@/utils/marketplace";

export function CustomConversationList() {
  const { setReceiver, setShowConversation, receiver } = useReceiver();
  const [showNewConversation, setShowNewConversation] = useState(false);
  const { user } = useAuth();
  const { friends, isLoadingFriends } = useFriendsList();
  const { conversations, loading: isLoadingConversations, handleDeleteConversation, createConversation } = useConversations();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { isDark } = useThemeContext();
  
  // Add refetch function
  const refetchConversations = () => {
    // This function is a placeholder - it will be properly implemented in useConversations
    console.log("Refreshing conversations");
  };

  useEffect(() => {
    const subscription = supabase
      .channel("messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, (payload) => {
        refetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  
  // Type-safe filtering for conversations
  const filteredConversations = conversations.filter(conv => {
    if (!conv) return false;
    
    // Handle participant as string
    if (typeof conv.participant === 'string') {
      return safeToLowerCase(conv.participant).includes(safeToLowerCase(searchQuery));
    } 
    // Handle participant as object with full_name
    else if (conv.participant && typeof conv.participant === 'object' && conv.participant.full_name) {
      return typeof conv.participant.full_name === 'string' ? 
        safeToLowerCase(conv.participant.full_name).includes(safeToLowerCase(searchQuery)) : 
        false;
    }
    return false;
  });
  
  const filteredFriends = friends.filter(friend => {
    const searchIn = friend.full_name?.toLowerCase() || "";
    return searchIn.includes(searchQuery.toLowerCase());
  });

  // Safely filter conversations based on the unread status
  const displayedConversations = activeTab === "all" 
    ? filteredConversations 
    : filteredConversations.filter(conv => {
        // Convert to number to ensure proper comparison
        const unreadCount = safeToNumber(conv.unread, 0);
        return unreadCount > 0;
      });

  // Vérifier si la liste de conversations est vide
  const isConversationsEmpty = displayedConversations.length === 0;

  // Type-safe conversion helper
  const ensureConversationProps = (conversation: Conversation) => {
    return {
      ...conversation,
      avatar_url: conversation.avatar_url || null,
      unread: safeToNumber(conversation.unread, 0),
      online: convertToBoolean(conversation.online),
      isPinned: convertToBoolean(conversation.isPinned),
      isMuted: convertToBoolean(conversation.isMuted)
    };
  };

  return (
    <div className="flex flex-col h-full">
      <div className={cn(
        "p-4 space-y-3",
        isDark ? "bg-[#1A1F2C]/40" : "bg-slate-50"
      )}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Messages</h2>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full"
            onClick={() => setShowNewConversation(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Nouveau message</span>
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-8 bg-background/60"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">Tous</TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">Non lus</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {isLoadingConversations ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-[72px] bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : isConversationsEmpty ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
            {searchQuery ? (
              <>
                <Search className="h-8 w-8 mb-2 opacity-50" />
                <p className="mb-1">Aucun résultat</p>
                <p className="text-sm">Essayez avec d'autres termes</p>
              </>
            ) : (
              <>
                <User2 className="h-8 w-8 mb-2 opacity-50" />
                <p className="mb-1">Aucune conversation</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-2"
                  onClick={() => setShowNewConversation(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Commencer une discussion
                </Button>
              </>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-1"
          >
            {displayedConversations.map((conversation) => {
              const safeConv = ensureConversationProps(conversation);
              const participantName = typeof safeConv.participant === 'string' 
                ? safeConv.participant 
                : safeConv.participant?.full_name || 'Contact';
              
              return (
                <CustomConversationItem
                  key={safeConv.id}
                  avatar={safeConv.avatar_url ?? undefined}
                  name={participantName}
                  message={safeConv.last_message}
                  time={safeConv.last_message_time}
                  unread={safeConv.unread}
                  online={safeConv.online}
                  isActive={receiver?.id === safeConv.participant1_id || receiver?.id === safeConv.participant2_id}
                  onClick={() => {
                    if (safeConv.participant1_id && safeConv.participant2_id) {
                      const partnerId = safeConv.participant1_id === user?.id 
                        ? safeConv.participant2_id 
                        : safeConv.participant1_id;
                      
                      setReceiver({
                        id: partnerId,
                        full_name: participantName,
                        avatar_url: safeConv.avatar_url,
                        online_status: safeConv.online
                      });
                      setShowConversation(true);
                    }
                  }}
                  isPinned={safeConv.isPinned}
                  isMuted={safeConv.isMuted}
                />
              );
            })}
          </motion.div>
        )}
      </div>
      
      <CustomNewConversationDialog
        open={showNewConversation}
        onOpenChange={setShowNewConversation}
        onContactSelect={(friend) => {
          setReceiver({
            id: friend.id,
            full_name: friend.full_name,
            avatar_url: friend.avatar_url,
            online_status: friend.online_status,
            last_seen: friend.last_seen
          });
          setShowConversation(true);
          setShowNewConversation(false);
        }}
        friends={filteredFriends}
        isLoading={isLoadingFriends}
      />
    </div>
  );
}
