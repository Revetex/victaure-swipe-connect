
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useReceiver } from "@/hooks/useReceiver";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { useThemeContext } from "@/components/ThemeProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserRole } from "@/types/messages";

type Conversation = {
  id: string;
  participant_id: string;
  full_name: string;
  avatar_url?: string;
  last_message?: string;
  last_message_time?: string;
  online_status?: boolean;
  unread_count: number;
};

export function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { setReceiver, setShowConversation } = useReceiver();
  const { isDark } = useThemeContext();
  const isMobile = useIsMobile();

  // Chargement des conversations
  useEffect(() => {
    if (!user) return;

    const loadConversations = async () => {
      try {
        setIsLoading(true);
        
        // Récupération des conversations via les tables standards
        const { data, error } = await supabase
          .from('user_conversations')
          .select(`
            id,
            participant1_id,
            participant2_id,
            participant1_last_read,
            participant2_last_read,
            last_message,
            last_message_time,
            profiles!user_conversations_participant1_id_fkey(id, full_name, avatar_url, online_status),
            profiles!user_conversations_participant2_id_fkey(id, full_name, avatar_url, online_status)
          `)
          .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
          .order('last_message_time', { ascending: false });

        if (error) throw error;
        
        // Transforme les données pour notre format de conversation
        const transformedData: Conversation[] = (data || []).map(conversation => {
          // Détermine l'autre participant (pas l'utilisateur courant)
          const isParticipant1 = conversation.participant1_id === user.id;
          const otherParticipantData = isParticipant1 
            ? conversation.profiles.find(p => p.id === conversation.participant2_id)
            : conversation.profiles.find(p => p.id === conversation.participant1_id);
          
          if (!otherParticipantData) return null;
          
          // Calcule le nombre de messages non lus
          // Logique simplifiée - à compléter avec une requête plus précise pour les non-lus
          const unreadCount = 0; // À remplacer par la logique réelle
          
          return {
            id: conversation.id,
            participant_id: otherParticipantData.id,
            full_name: otherParticipantData.full_name || 'Utilisateur',
            avatar_url: otherParticipantData.avatar_url,
            last_message: conversation.last_message || '',
            last_message_time: conversation.last_message_time,
            online_status: otherParticipantData.online_status,
            unread_count: unreadCount
          };
        }).filter(Boolean) as Conversation[];
        
        setConversations(transformedData);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();

    // On écoute les changements sur les conversations
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${user.id},receiver_id.eq.${user.id})`
        },
        () => {
          // Quand un message est ajouté ou modifié, on recharge les conversations
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const filteredConversations = conversations.filter(
    (conversation) => 
      conversation.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectConversation = async (conversation: Conversation) => {
    try {
      // Récupérer le profil complet
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', conversation.participant_id)
        .single();

      if (error) throw error;

      if (profile) {
        const validRoles: UserRole[] = ['professional', 'business', 'admin'];
        const userRole: UserRole = validRoles.includes(profile.role as UserRole) 
          ? (profile.role as UserRole) 
          : 'professional';
            
        setReceiver({
          id: profile.id,
          full_name: profile.full_name || '',
          avatar_url: profile.avatar_url,
          email: profile.email,
          role: userRole,
          bio: profile.bio,
          phone: profile.phone,
          city: profile.city,
          state: profile.state,
          country: profile.country || '',
          skills: profile.skills || [],
          online_status: profile.online_status ? 'online' : 'offline',
          last_seen: profile.last_seen,
        });
        setShowConversation(true);
      }
    } catch (error) {
      console.error('Error selecting conversation:', error);
    }
  };

  const formatLastActive = (date?: string) => {
    if (!date) return '';
    return formatDistance(new Date(date), new Date(), {
      addSuffix: true,
      locale: fr
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className={cn(
        "px-4 py-3 flex justify-between items-center",
        "border-b",
        isDark ? "border-[#64B5D9]/10" : "border-slate-200"
      )}>
        <h2 className={cn(
          "font-semibold",
          isDark ? "text-white" : "text-slate-900"
        )}>
          Messages
        </h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "rounded-full",
              isDark 
                ? "text-white/80 hover:text-white hover:bg-white/10" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "rounded-full",
              isDark 
                ? "text-white/80 hover:text-white hover:bg-white/10" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className={cn(
        "p-4",
        "border-b",
        isDark ? "border-[#64B5D9]/10" : "border-slate-200"
      )}>
        <div className={cn(
          "relative",
          "flex items-center",
          isDark ? "text-white/80" : "text-slate-600"
        )}>
          <Search className="absolute left-3 h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className={cn(
              "pl-9",
              isDark 
                ? "bg-[#1A1F2C]/80 border-[#64B5D9]/10 placeholder-white/40" 
                : "bg-slate-100 border-slate-200 placeholder-slate-400"
            )}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className={cn(
              "animate-pulse h-5 w-24 rounded",
              isDark ? "bg-white/10" : "bg-slate-200"
            )} />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className={cn(
            "p-8 text-center",
            isDark ? "text-white/50" : "text-slate-500"
          )}>
            {searchQuery ? 'Aucun résultat' : 'Aucune conversation'}
          </div>
        ) : (
          <div className="py-2">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                className={cn(
                  "w-full px-4 py-3 flex items-center gap-3",
                  "hover:transition-colors duration-200 ease-in-out",
                  isDark 
                    ? "hover:bg-white/5" 
                    : "hover:bg-slate-100",
                  conversation.unread_count > 0 && isDark && "bg-[#1A1F2C]/80",
                  conversation.unread_count > 0 && !isDark && "bg-blue-50/80"
                )}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="relative">
                  <UserAvatar
                    user={{
                      id: conversation.participant_id,
                      name: conversation.full_name,
                      image: conversation.avatar_url
                    }}
                    className="h-12 w-12"
                  />
                  {conversation.online_status && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#1B2A4A]"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex justify-between items-center">
                    <h3 className={cn(
                      "truncate font-medium",
                      isDark ? "text-white" : "text-slate-900",
                      conversation.unread_count > 0 && "font-semibold"
                    )}>
                      {conversation.full_name}
                    </h3>
                    <span className={cn(
                      "text-xs",
                      isDark ? "text-white/50" : "text-slate-500",
                      conversation.unread_count > 0 && isDark && "text-white/80",
                      conversation.unread_count > 0 && !isDark && "text-slate-900"
                    )}>
                      {formatLastActive(conversation.last_message_time)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <p className={cn(
                      "truncate text-sm",
                      isDark ? "text-white/60" : "text-slate-500",
                      conversation.unread_count > 0 && isDark && "text-white/80",
                      conversation.unread_count > 0 && !isDark && "text-slate-900"
                    )}>
                      {conversation.last_message || 'Aucun message'}
                    </p>
                    
                    {conversation.unread_count > 0 && (
                      <span className={cn(
                        "flex items-center justify-center min-w-5 h-5 rounded-full text-xs font-medium",
                        "bg-blue-500 text-white"
                      )}>
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
