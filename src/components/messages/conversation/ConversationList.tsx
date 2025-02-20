
import { useState, useEffect } from "react";
import { useReceiver } from "@/hooks/useReceiver";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/UserAvatar";
import type { UserProfile } from "@/types/profile";
import type { Receiver } from "@/types/messages";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface ConversationListProps {
  className?: string;
}

interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message: string;
  last_message_time: string;
  participant: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    email: string;
    role: 'professional' | 'business' | 'admin';
    bio: string | null;
    phone: string | null;
    city: string | null;
    state: string | null;
    country: string;
    skills: string[];
    latitude: number | null;
    longitude: number | null;
    online_status: boolean;
    last_seen: string;
    certifications: any[];
    education: any[];
    experiences: any[];
  };
}

export function ConversationList({ className }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { setReceiver, setShowConversation } = useReceiver();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant:profiles!conversations_participant2_id_fkey(*)
        `)
        .eq('participant1_id', user.id)
        .not('id', 'is', null);

      if (error) throw error;

      if (data) {
        setConversations(data);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error("Impossible de charger les conversations");
    }
  };

  const handleSelectConversation = (participant: UserProfile) => {
    const receiver: Receiver = {
      id: participant.id,
      full_name: participant.full_name || '',
      avatar_url: participant.avatar_url,
      email: participant.email,
      role: participant.role,
      bio: participant.bio,
      phone: participant.phone,
      city: participant.city,
      state: participant.state,
      country: participant.country || 'Canada',
      skills: participant.skills || [],
      latitude: participant.latitude,
      longitude: participant.longitude,
      online_status: participant.online_status ? 'online' : 'offline',
      last_seen: participant.last_seen,
      certifications: participant.certifications || [],
      education: participant.education || [],
      experiences: participant.experiences || [],
      friends: []
    };
    
    setReceiver(receiver);
    setShowConversation(true);
  };

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;

      const { error } = await supabase
        .rpc('mark_conversation_deleted', { 
          p_user_id: user.id, 
          p_conversation_partner_id: conversation.participant2_id
        });

      if (error) throw error;

      setConversations(prevConversations => 
        prevConversations.filter(c => c.id !== conversationId)
      );
      
      toast.success("Conversation supprimée");
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error("Impossible de supprimer la conversation");
    }
  };

  const handleAddConversation = () => {
    navigate('/feed/friends');
  };

  return (
    <div className={cn("flex flex-col border-r pt-20", className)}>
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="shrink-0"
            onClick={handleAddConversation}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors relative group"
              onClick={() => handleSelectConversation(conversation.participant)}
            >
              <UserAvatar
                user={conversation.participant}
                className="h-12 w-12"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="font-medium truncate">
                    {conversation.participant.full_name}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(conversation.last_message_time).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {conversation.last_message}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleDeleteConversation(conversation.id, e)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
