
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ConversationItem } from "./components/ConversationItem";
import { ConversationSearch } from "./components/ConversationSearch";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, RefreshCw } from "lucide-react";
import { NewConversationPopover } from "./components/NewConversationPopover";
import { useFriendsList } from "./hooks/useFriendsList";
import { Receiver } from "@/types/messages";
import { useReceiver } from "@/hooks/useReceiver";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { dbCache } from "@/utils/databaseCache";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

type Conversation = {
  id: string;
  participant: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    online_status: boolean;
  };
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
};

export function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const { friends, isLoadingFriends } = useFriendsList();
  const { setReceiver, setShowConversation } = useReceiver();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("recent");

  // Effet de chargement des conversations
  useEffect(() => {
    if (!user) return;
    
    const loadConversations = async () => {
      try {
        const cacheKey = `conversations:${user.id}`;
        
        const conversationsData = await dbCache.get(
          cacheKey,
          async () => {
            const { data: messagesData, error: messagesError } = await supabase
              .from('messages')
              .select(`
                id, 
                content, 
                sender_id, 
                receiver_id, 
                created_at,
                status
              `)
              .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
              .order('created_at', { ascending: false });

            if (messagesError) throw messagesError;

            // Extraire les IDs uniques des participants
            const participantIds = new Set<string>();
            messagesData?.forEach(msg => {
              const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
              participantIds.add(otherId);
            });

            // Récupérer les profils des participants
            const { data: profilesData, error: profilesError } = await supabase
              .from('profiles')
              .select('id, full_name, avatar_url, online_status, last_seen')
              .in('id', Array.from(participantIds));

            if (profilesError) throw profilesError;

            // Organiser les messages par conversation
            const conversationsMap = new Map<string, Conversation>();

            messagesData?.forEach(msg => {
              const participantId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
              const participant = profilesData?.find(p => p.id === participantId);
              
              if (!participant) return;

              const convoKey = participantId;
              
              // Si cette conversation n'existe pas encore dans notre map ou si ce message est plus récent
              if (!conversationsMap.has(convoKey) || 
                  new Date(msg.created_at) > new Date(conversationsMap.get(convoKey)!.lastMessageTime || '')) {
                
                const existingConvo = conversationsMap.get(convoKey);
                const unreadCount = existingConvo?.unreadCount || 0;
                
                // Incrémenter le compteur de non lus si nécessaire
                const newUnreadCount = 
                  msg.sender_id !== user.id && msg.status !== 'read' 
                    ? (existingConvo ? unreadCount + 1 : 1)
                    : unreadCount;
                
                conversationsMap.set(convoKey, {
                  id: convoKey,
                  participant: {
                    id: participant.id,
                    full_name: participant.full_name || 'Utilisateur',
                    avatar_url: participant.avatar_url,
                    online_status: participant.online_status || false
                  },
                  lastMessage: msg.content,
                  lastMessageTime: msg.created_at,
                  unreadCount: newUnreadCount
                });
              }
            });

            return Array.from(conversationsMap.values())
              .sort((a, b) => 
                new Date(b.lastMessageTime || '').getTime() - 
                new Date(a.lastMessageTime || '').getTime()
              );
          },
          15000 // Cache valide pendant 15 secondes
        );
        
        setConversations(conversationsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading conversations:", error);
        setIsLoading(false);
      }
    };

    loadConversations();

    // Abonnement aux changements de messages en temps réel
    const channel = supabase
      .channel('conversations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${user.id},receiver_id.eq.${user.id})`
        },
        (payload) => {
          console.log("Conversation change detected:", payload);
          // Invalidation du cache pour forcer le rechargement
          dbCache.invalidatePattern(`conversations:${user.id}`);
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSelectConversation = (participantId: string) => {
    const convo = conversations.find(c => c.participant.id === participantId);
    
    if (convo) {
      const receiver: Receiver = {
        id: convo.participant.id,
        full_name: convo.participant.full_name,
        avatar_url: convo.participant.avatar_url,
        email: '',
        role: 'professional',
        bio: null,
        phone: null,
        city: null,
        state: null,
        country: '',
        skills: [],
        latitude: null,
        longitude: null,
        online_status: convo.participant.online_status ? 'online' : 'offline',
        last_seen: null,
        certifications: [],
        education: [],
        experiences: [],
        friends: [],
      };

      setReceiver(receiver);
      setShowConversation(true);
      
      // Marquer les messages comme lus
      supabase
        .from('messages')
        .update({ status: 'read' })
        .eq('sender_id', participantId)
        .eq('receiver_id', user?.id)
        .eq('status', 'sent')
        .then(() => {
          // Rafraîchir les conversations pour mettre à jour les compteurs non lus
          dbCache.invalidatePattern(`conversations:${user?.id}`);
        });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(!!query);
  };

  const filteredConversations = isSearching 
    ? conversations.filter(convo => 
        convo.participant.full_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : conversations;

  const handleStartNewConversation = (friend: any) => {
    const receiver: Receiver = {
      id: friend.id,
      full_name: friend.full_name,
      avatar_url: friend.avatar_url,
      email: friend.email || '',
      role: friend.role || 'professional',
      bio: friend.bio || null,
      phone: friend.phone || null,
      city: friend.city || null,
      state: friend.state || null,
      country: friend.country || '',
      skills: friend.skills || [],
      latitude: friend.latitude || null,
      longitude: friend.longitude || null,
      online_status: friend.online_status ? 'online' : 'offline',
      last_seen: friend.last_seen || null,
      certifications: [],
      education: [],
      experiences: [],
      friends: [],
    };

    setReceiver(receiver);
    setShowConversation(true);
    setShowNewConversation(false);
  };

  const refreshConversations = () => {
    setIsLoading(true);
    dbCache.invalidatePattern(`conversations:${user?.id}`);
  };

  return (
    <div className="h-full bg-gradient-to-b from-[#1B2A4A]/50 to-[#1A1F2C]/50 flex flex-col">
      <div className="p-4 border-b border-[#64B5D9]/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#F2EBE4]">Messagerie</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-[#64B5D9]/10 text-[#F2EBE4]/70 hover:text-[#F2EBE4] hover:bg-[#64B5D9]/10"
              onClick={refreshConversations}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline" 
              size="icon"
              className="h-8 w-8 border-[#64B5D9]/10 text-[#F2EBE4]/70 hover:text-[#F2EBE4] hover:bg-[#64B5D9]/10"
              onClick={() => setShowNewConversation(!showNewConversation)}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ConversationSearch onSearch={handleSearch} isSearching={isSearching} />

        {showNewConversation && (
          <NewConversationPopover
            onSelect={handleStartNewConversation}
            onClose={() => setShowNewConversation(false)}
            friends={friends}
            isLoading={isLoadingFriends}
          />
        )}
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col min-h-0"
      >
        <TabsList className="p-2 bg-transparent justify-start h-auto border-b border-[#64B5D9]/10">
          <TabsTrigger 
            value="recent" 
            className="data-[state=active]:bg-[#64B5D9]/10 data-[state=active]:text-[#F2EBE4] data-[state=active]:shadow-none"
          >
            Récents
          </TabsTrigger>
          <TabsTrigger 
            value="contacts" 
            className="data-[state=active]:bg-[#64B5D9]/10 data-[state=active]:text-[#F2EBE4] data-[state=active]:shadow-none"
          >
            Contacts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="flex-1 overflow-hidden m-0 p-0">
          <ScrollArea className="h-full">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="space-y-2 p-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-full max-w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredConversations.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {filteredConversations.map((convo) => (
                    <ConversationItem
                      key={convo.id}
                      name={convo.participant.full_name}
                      avatarUrl={convo.participant.avatar_url}
                      lastMessage={convo.lastMessage}
                      time={convo.lastMessageTime}
                      unreadCount={convo.unreadCount}
                      isOnline={convo.participant.online_status}
                      onClick={() => handleSelectConversation(convo.participant.id)}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-10 px-4 text-center h-full"
                >
                  <div className="w-16 h-16 rounded-full bg-[#64B5D9]/10 flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-[#64B5D9]" />
                  </div>
                  <h3 className="text-lg font-medium text-[#F2EBE4] mb-2">
                    {isSearching 
                      ? "Aucune conversation trouvée" 
                      : "Aucune conversation"}
                  </h3>
                  <p className="text-[#F2EBE4]/60 max-w-xs mb-6">
                    {isSearching 
                      ? "Essayez un autre terme de recherche" 
                      : "Commencez à discuter avec vos contacts"}
                  </p>
                  <Button 
                    onClick={() => setShowNewConversation(true)}
                    className="bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-[#1E293B]"
                  >
                    Nouvelle conversation
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="contacts" className="flex-1 overflow-hidden m-0 p-0">
          <ScrollArea className="h-full">
            <AnimatePresence mode="wait">
              {isLoadingFriends ? (
                <div className="space-y-2 p-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-36" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : friends.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-2 space-y-1"
                >
                  {friends
                    .filter(friend => searchQuery 
                      ? friend.full_name.toLowerCase().includes(searchQuery.toLowerCase())
                      : true)
                    .map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1A2335]/70 cursor-pointer transition-colors"
                        onClick={() => handleStartNewConversation(friend)}
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10 border border-[#64B5D9]/20">
                            <AvatarImage src={friend.avatar_url || ""} />
                            <AvatarFallback className="bg-[#1A2335] text-[#64B5D9]">
                              {friend.full_name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {friend.online_status && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#1B2A4A]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#F2EBE4] font-medium truncate">{friend.full_name}</p>
                        </div>
                      </div>
                    ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-10 px-4 text-center h-full"
                >
                  <div className="w-16 h-16 rounded-full bg-[#64B5D9]/10 flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-[#64B5D9]" />
                  </div>
                  <h3 className="text-lg font-medium text-[#F2EBE4] mb-2">
                    Aucun contact trouvé
                  </h3>
                  <p className="text-[#F2EBE4]/60 max-w-xs mb-6">
                    Ajoutez des contacts pour commencer à discuter avec eux
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
