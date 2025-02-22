
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Database } from "@/integrations/supabase/types";

export interface NewConversationPopoverProps {
  onSelectFriend: () => void;
  onLoadFriends?: () => Promise<any[]>;
  friends?: any[];
  loadingFriends?: boolean;
}

interface Friend {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

export function NewConversationPopover({ 
  onSelectFriend,
  onLoadFriends,
  friends: propsFriends,
  loadingFriends: propsLoadingFriends 
}: NewConversationPopoverProps) {
  const [open, setOpen] = useState(false);
  const [localFriends, setLocalFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadFriends = async () => {
    if (onLoadFriends) {
      return onLoadFriends();
    }

    try {
      setLoading(true);
      const { data: friendships, error } = await supabase
        .from('friendships')
        .select(`
          friend_id,
          friend:profiles!friendships_friend_id_fkey (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('user_id', user?.id)
        .eq('status', 'accepted');

      if (error) throw error;
      
      return friendships?.map(f => f.friend) || [];
    } catch (error) {
      console.error('Error loading friends:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && !propsFriends) {
      loadFriends().then(setLocalFriends);
    }
  }, [open, propsFriends]);

  const friends = propsFriends || localFriends;
  const isLoading = propsLoadingFriends || loading;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-0">
        <div className="p-2">
          <h4 className="text-sm font-medium px-2 py-1">Nouvelle conversation</h4>
        </div>
        <ScrollArea className="h-72">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <span className="loading loading-spinner" />
            </div>
          ) : friends.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Aucun ami trouvé
            </div>
          ) : (
            friends.map((friend: Friend) => (
              <button
                key={friend.id}
                onClick={() => {
                  onSelectFriend();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 p-2 hover:bg-muted/50 transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={friend.avatar_url || ""} />
                  <AvatarFallback>
                    {friend.full_name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{friend.full_name}</span>
              </button>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
