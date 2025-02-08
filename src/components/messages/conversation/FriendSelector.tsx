import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FriendSelectorProps {
  onSelectFriend: (friendId: string) => void;
  children?: React.ReactNode;
}

export function FriendSelector({ onSelectFriend, children }: FriendSelectorProps) {
  const { profile } = useProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour voir vos amis");
        return [];
      }

      const { data: acceptedRequests, error } = await supabase
        .from("friend_requests")
        .select(`
          sender:profiles!friend_requests_sender_id_fkey(
            id,
            full_name,
            avatar_url,
            online_status,
            last_seen
          ),
          receiver:profiles!friend_requests_receiver_id_fkey(
            id,
            full_name,
            avatar_url,
            online_status,
            last_seen
          )
        `)
        .eq("status", "accepted")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (error) {
        console.error("Error fetching friends:", error);
        toast.error("Erreur lors du chargement de vos amis");
        return [];
      }

      return acceptedRequests.map(request => {
        const friend = request.sender.id === user.id ? request.receiver : request.sender;
        return friend;
      });
    }
  });

  const handleSelectFriend = (friendId: string) => {
    onSelectFriend(friendId);
    setIsOpen(false);
  };

  const filteredFriends = friends.filter(friend => 
    friend.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="icon">
            <UserPlus className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle conversation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Rechercher un ami..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {isLoading ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Chargement de vos amis...
                </p>
              ) : filteredFriends.length > 0 ? (
                filteredFriends.map((friend) => (
                  <Button
                    key={friend.id}
                    onClick={() => handleSelectFriend(friend.id)}
                    variant="outline"
                    className="w-full justify-start gap-3 h-auto p-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={friend.avatar_url || undefined} alt={friend.full_name || ''} />
                      <AvatarFallback>
                        {friend.full_name?.slice(0, 2).toUpperCase() || '??'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{friend.full_name}</p>
                      {friend.online_status ? (
                        <p className="text-xs text-green-500">En ligne</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Hors ligne
                        </p>
                      )}
                    </div>
                  </Button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {searchQuery ? "Aucun ami trouvé" : "Aucun ami pour le moment"}
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}