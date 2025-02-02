import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function SearchHeader() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data: sentRequests, error: sentError } = await supabase
        .from("friend_requests")
        .select(`
          id,
          status,
          receiver:profiles!friend_requests_receiver_id_fkey(
            id,
            full_name,
            avatar_url,
            email
          )
        `)
        .eq("sender_id", (await supabase.auth.getUser()).data.user?.id);

      const { data: receivedRequests, error: receivedError } = await supabase
        .from("friend_requests")
        .select(`
          id,
          status,
          sender:profiles!friend_requests_sender_id_fkey(
            id,
            full_name,
            avatar_url,
            email
          )
        `)
        .eq("receiver_id", (await supabase.auth.getUser()).data.user?.id);

      if (sentError || receivedError) {
        console.error("Error fetching friends:", sentError || receivedError);
        throw new Error("Error fetching friends");
      }

      const friends = [
        ...(sentRequests?.map((request) => ({
          id: request.receiver.id,
          full_name: request.receiver.full_name,
          avatar_url: request.receiver.avatar_url,
          email: request.receiver.email,
          status: request.status,
        })) || []),
        ...(receivedRequests?.map((request) => ({
          id: request.sender.id,
          full_name: request.sender.full_name,
          avatar_url: request.sender.avatar_url,
          email: request.sender.email,
          status: request.status,
        })) || []),
      ];

      return friends;
    },
  });

  const filteredFriends = friends.filter((friend) =>
    friend.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectFriend = async (friendId: string) => {
    try {
      const { data: existingConversation, error: conversationError } = await supabase
        .from("messages")
        .select("id")
        .or(`sender_id.eq.${friendId},receiver_id.eq.${friendId}`)
        .limit(1);

      if (conversationError) {
        throw conversationError;
      }

      // Create initial message to start the conversation
      const { data: newMessage, error: messageError } = await supabase
        .from("messages")
        .insert({
          sender_id: (await supabase.auth.getUser()).data.user?.id,
          receiver_id: friendId,
          content: "👋 Bonjour!",
        })
        .select()
        .single();

      if (messageError) {
        throw messageError;
      }

      setOpen(false);
      navigate(`/dashboard/messages/${friendId}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Erreur lors de la création de la conversation");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0">
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Rechercher un ami..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            {isLoading ? (
              <div className="text-center text-sm text-muted-foreground">
                Chargement...
              </div>
            ) : filteredFriends.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground">
                Aucun ami trouvé
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() => handleSelectFriend(friend.id)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={friend.avatar_url || ""} />
                        <AvatarFallback>
                          {friend.full_name?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{friend.full_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {friend.email}
                        </div>
                      </div>
                    </div>
                    {friend.status === "pending" && (
                      <Badge variant="secondary">En attente</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}