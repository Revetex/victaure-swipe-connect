import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CircleDot, User, MessageCircle, UserPlus, UserMinus, Check, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FriendsList() {
  const navigate = useNavigate();
  
  const { data: friends, refetch: refetchFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: friendRequests } = await supabase
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
          ),
          status
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq("status", "accepted");

      return friendRequests?.map(request => {
        const friend = request.sender.id === user.id ? request.receiver : request.sender;
        return friend;
      }) || [];
    }
  });

  const { data: pendingRequests, refetch: refetchPending } = useQuery({
    queryKey: ["pendingFriendRequests"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: requests } = await supabase
        .from("friend_requests")
        .select(`
          id,
          sender:profiles!friend_requests_sender_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq("receiver_id", user.id)
        .eq("status", "pending");

      return requests || [];
    }
  });

  const handleMessage = (friendId: string) => {
    navigate(`/dashboard/messages/${friendId}`);
  };

  const handleAcceptRequest = async (requestId: string, senderId: string, senderName: string) => {
    try {
      const { error: updateError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      toast.success(`Vous êtes maintenant ami avec ${senderName}`);
      refetchFriends();
      refetchPending();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error("Une erreur est survenue");
    }
  };

  const handleRejectRequest = async (requestId: string, senderName: string) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      toast.success(`Demande de ${senderName} refusée`);
      refetchPending();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm h-full">
      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="friends" className="flex-1">
            <User className="h-4 w-4 mr-2" />
            Amis
          </TabsTrigger>
          {pendingRequests?.length > 0 && (
            <TabsTrigger value="requests" className="flex-1">
              <UserPlus className="h-4 w-4 mr-2" />
              Demandes
              <span className="ml-2 bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">
                {pendingRequests.length}
              </span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="friends" className="mt-0">
          <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
            <AnimatePresence>
              {friends?.map((friend) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors group relative"
                >
                  <Avatar className="h-10 w-10 border-2 border-primary/10">
                    <AvatarImage src={friend.avatar_url || ''} alt={friend.full_name || ''} />
                    <AvatarFallback>{friend.full_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{friend.full_name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <CircleDot className={`h-2 w-2 ${friend.online_status ? "text-green-500" : "text-gray-300"}`} />
                      {friend.online_status ? "En ligne" : "Hors ligne"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleMessage(friend.id)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
              {(!friends || friends.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aucun ami pour le moment</p>
                  <p className="text-sm">Commencez à ajouter des amis!</p>
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="requests" className="mt-0">
          <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
            <AnimatePresence>
              {pendingRequests?.map((request) => (
                <motion.div
                  key={request.sender.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/10 rounded-lg mb-2"
                >
                  <Avatar className="h-10 w-10 border-2 border-primary/10">
                    <AvatarImage src={request.sender.avatar_url || ''} alt={request.sender.full_name || ''} />
                    <AvatarFallback>{request.sender.full_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{request.sender.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Souhaite vous ajouter comme ami
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      className="h-8 w-8 p-0"
                      onClick={() => handleAcceptRequest(request.id, request.sender.id, request.sender.full_name)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => handleRejectRequest(request.id, request.sender.full_name)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}