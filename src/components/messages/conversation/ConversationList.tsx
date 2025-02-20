
import { useState } from "react";
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

interface ConversationListProps {
  className?: string;
}

export function ConversationList({ className }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { setReceiver, setShowConversation } = useReceiver();
  const { user } = useAuth();

  const mockUser: UserProfile = {
    id: '1',
    full_name: 'John Doe',
    avatar_url: null,
    email: 'john@example.com',
    role: 'professional',
    bio: null,
    phone: null,
    city: null,
    state: null,
    country: null,
    skills: [],
    latitude: null,
    longitude: null,
    online_status: false,
    last_seen: new Date().toISOString(),
    certifications: [],
    education: [],
    experiences: [],
    friends: []
  };

  const handleSelectConversation = (user: UserProfile) => {
    // Transform UserProfile to Receiver
    const receiver: Receiver = {
      id: user.id,
      full_name: user.full_name || '',
      avatar_url: user.avatar_url,
      email: user.email,
      role: user.role,
      bio: user.bio,
      phone: user.phone,
      city: user.city,
      state: user.state,
      country: user.country,
      skills: user.skills,
      latitude: user.latitude,
      longitude: user.longitude,
      online_status: 'online',
      last_seen: new Date().toISOString(),
      certifications: user.certifications,
      education: user.education,
      experiences: user.experiences,
      friends: user.friends?.map(friend => friend.id) || []
    };
    
    setReceiver(receiver);
    setShowConversation(true);
  };

  const handleDeleteConversation = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    try {
      const { error } = await supabase
        .rpc('mark_conversation_deleted', { 
          p_user_id: user.id, 
          p_conversation_partner_id: userId 
        });

      if (error) throw error;
      toast.success("Conversation supprimée");
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error("Impossible de supprimer la conversation");
    }
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
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          <button
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors relative group"
            onClick={() => handleSelectConversation(mockUser)}
          >
            <UserAvatar
              user={mockUser}
              className="h-12 w-12"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <p className="font-medium truncate">{mockUser.full_name}</p>
                <span className="text-xs text-muted-foreground">12:30</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                Dernier message...
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => handleDeleteConversation(mockUser.id, e)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </button>
        </div>
      </ScrollArea>
    </div>
  );
}
