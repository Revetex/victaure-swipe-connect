import { Search, MessageSquarePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchHeaderProps {
  unreadCount: number;
  onSearch: (value: string) => void;
  onNewConversation: () => void;
}

export function SearchHeader({ unreadCount, onSearch }: SearchHeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchFriend, setSearchFriend] = useState("");
  const [friends, setFriends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchFriends = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: friendRequests } = await supabase
        .from('friend_requests')
        .select(`
          sender:profiles!friend_requests_sender_id_fkey(id, full_name, avatar_url, email),
          receiver:profiles!friend_requests_receiver_id_fkey(id, full_name, avatar_url, email),
          status
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (friendRequests) {
        const friendsList = friendRequests.map(request => {
          const friend = request.sender.id === user.id ? request.receiver : request.sender;
          return {
            ...friend,
            status: request.status
          };
        });
        setFriends(friendsList);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    fetchFriends();
  };

  const filteredFriends = friends.filter(friend => 
    friend.full_name?.toLowerCase().includes(searchFriend.toLowerCase()) ||
    friend.email?.toLowerCase().includes(searchFriend.toLowerCase())
  );

  const handleSelectFriend = (friendId: string) => {
    setIsDialogOpen(false);
    navigate(`/dashboard/messages/${friendId}`);
  };

  return (
    <div className="border-b p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Messages</h1>
        {unreadCount > 0 && (
          <Badge variant="default" className="bg-primary">
            {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans les messages..."
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="default"
          size="icon"
          onClick={handleOpenDialog}
          className="shrink-0"
        >
          <MessageSquarePlus className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nouvelle conversation</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <Input
              placeholder="Rechercher un ami..."
              value={searchFriend}
              onChange={(e) => setSearchFriend(e.target.value)}
              className="w-full"
            />
            
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">Chargement...</p>
                </div>
              ) : filteredFriends.length > 0 ? (
                <div className="space-y-4">
                  {filteredFriends.map((friend) => (
                    <div
                      key={friend.id}
                      onClick={() => friend.status === 'accepted' && handleSelectFriend(friend.id)}
                      className={`flex items-center justify-between p-2 rounded-lg hover:bg-accent ${friend.status === 'accepted' ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={friend.avatar_url} />
                          <AvatarFallback>
                            <UserRound className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{friend.full_name || 'Sans nom'}</p>
                          <p className="text-xs text-muted-foreground">{friend.email}</p>
                        </div>
                      </div>
                      {friend.status === 'pending' && (
                        <Badge variant="secondary" className="ml-2">En attente</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">Aucun ami trouvé</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}