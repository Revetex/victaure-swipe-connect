
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export interface NewConversationPopoverProps {
  onSelectFriend: () => void;
}

interface Friend {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface FriendshipResponse {
  friend: Friend | null;
}

export function NewConversationPopover({ onSelectFriend }: NewConversationPopoverProps) {
  const [open, setOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadFriends = async () => {
      if (!user?.id || !open) return;
      
      try {
        setLoading(true);
        const { data: friendships, error } = await supabase
          .from('friendships')
          .select(`
            friend:profiles!friendships_friend_id_fkey (
              id,
              full_name,
              avatar_url
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;
        
        if (friendships) {
          const formattedFriends = friendships
            .filter((friendship): friendship is FriendshipResponse & { friend: Friend } => 
              friendship?.friend !== null && 
              typeof friendship.friend === 'object' &&
              'id' in friendship.friend
            )
            .map(friendship => friendship.friend);
          setFriends(formattedFriends);
        }
      } catch (error) {
        console.error('Error loading friends:', error);
        toast.error("Impossible de charger la liste d'amis");
      } finally {
        setLoading(false);
      }
    };

    loadFriends();
  }, [open, user?.id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="shrink-0"
          title="Nouvelle conversation"
          aria-label="Créer une nouvelle conversation"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouvelle conversation</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-72">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <span className="loading loading-spinner" />
            </div>
          ) : friends.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Aucun ami trouvé
            </div>
          ) : (
            friends.map((friend) => (
              <button
                key={friend.id}
                onClick={() => {
                  onSelectFriend();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 p-2 hover:bg-muted/50 transition-colors"
                title={`Démarrer une conversation avec ${friend.full_name}`}
                aria-label={`Démarrer une conversation avec ${friend.full_name}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={friend.avatar_url || ""} alt={friend.full_name || ""} />
                  <AvatarFallback>
                    {friend.full_name?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{friend.full_name}</span>
              </button>
            ))
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
