
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./CustomDialog";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { UserProfile } from "@/types/profile";

export interface NewConversationPopoverProps {
  onSelectFriend: () => void;
}

interface Friend {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  online_status: boolean;
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
        const { data: connections, error } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            avatar_url,
            online_status
          `)
          .in('id', (
            await supabase
              .from('friendships')
              .select('friend_id')
              .eq('user_id', user.id)
          ).data?.map(f => f.friend_id) || []);

        if (error) throw error;
        
        if (connections) {
          setFriends(connections);
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
        <ScrollArea className="h-72 pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : friends.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Aucun ami trouvé
            </div>
          ) : (
            <div className="space-y-2">
              {friends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => {
                    onSelectFriend();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={friend.avatar_url || ""} alt={friend.full_name || ""} />
                      <AvatarFallback>
                        {friend.full_name?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                    {friend.online_status && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{friend.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {friend.online_status ? 'En ligne' : 'Hors ligne'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
