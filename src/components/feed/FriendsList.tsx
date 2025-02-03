import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CircleDot, User, MessageCircle, UserPlus, UserMinus, Check, X, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { useState } from "react";
import { ProfilePreview } from "@/components/ProfilePreview";

type FriendPreview = {
  id: string;
  full_name: string;
  avatar_url: string;
  online_status: boolean;
  last_seen: string;
};

type PendingRequest = {
  id: string;
  sender: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  receiver: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  type: 'incoming' | 'outgoing';
};

export function FriendsList() {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  
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
        return friend as FriendPreview;
      }) || [];
    }
  });

  const { data: pendingRequests = [], refetch: refetchPendingRequests } = useQuery({
    queryKey: ["pending-requests"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get incoming requests
      const { data: incomingRequests } = await supabase
        .from("friend_requests")
        .select(`
          id,
          sender:profiles!friend_requests_sender_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          receiver:profiles!friend_requests_receiver_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq("receiver_id", user.id)
        .eq("status", "pending");

      // Get outgoing requests
      const { data: outgoingRequests } = await supabase
        .from("friend_requests")
        .select(`
          id,
          sender:profiles!friend_requests_sender_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          receiver:profiles!friend_requests_receiver_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq("sender_id", user.id)
        .eq("status", "pending");

      const formattedIncoming = (incomingRequests || []).map(request => ({
        ...request,
        type: 'incoming' as const
      }));

      const formattedOutgoing = (outgoingRequests || []).map(request => ({
        ...request,
        type: 'outgoing' as const
      }));

      return [...formattedIncoming, ...formattedOutgoing] as PendingRequest[];
    }
  });

  const handleAcceptRequest = async (requestId: string, senderId: string, senderName: string) => {
    const { error } = await supabase
      .from("friend_requests")
      .update({ status: "accepted" })
      .eq("id", requestId);

    if (error) {
      toast.error("Erreur lors de l'acceptation de la demande");
      return;
    }

    toast.success(`Vous êtes maintenant ami avec ${senderName}`);
    refetchFriends();
    refetchPendingRequests();
  };

  const handleRejectRequest = async (requestId: string, senderName: string) => {
    const { error } = await supabase
      .from("friend_requests")
      .delete()
      .eq("id", requestId);

    if (error) {
      toast.error("Erreur lors du rejet de la demande");
      return;
    }

    toast.success(`Vous avez rejeté la demande de ${senderName}`);
    refetchPendingRequests();
  };

  const handleCancelRequest = async (requestId: string, receiverName: string) => {
    const { error } = await supabase
      .from("friend_requests")
      .delete()
      .eq("id", requestId);

    if (error) {
      toast.error("Erreur lors de l'annulation de la demande");
      return;
    }

    toast.success(`Demande d'ami à ${receiverName} annulée`);
    refetchPendingRequests();
  };

  const handleMessage = (friendId: string) => {
    navigate(`/dashboard/messages/${friendId}`);
  };

  const handleProfileSelect = (profile: UserProfile) => {
    setSelectedProfile(profile);
  };

  const handleViewFriendProfile = (friend: FriendPreview) => {
    setSelectedProfile(friend as UserProfile);
  };

  return (
    <>
      <Card className="p-4 bg-card/50 backdrop-blur-sm">
        <div className="mb-6">
          <ProfileSearch 
            onSelect={handleProfileSelect}
            placeholder="Rechercher quelqu'un..."
          />
        </div>

        {/* Pending Requests Section */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Demandes en attente
          </h3>
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div 
                  key={request.id} 
                  className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/10 rounded-lg animate-pulse"
                >
                  <Avatar className="h-10 w-10 border-2 border-primary/10">
                    <AvatarImage 
                      src={request.type === 'incoming' ? request.sender.avatar_url : request.receiver.avatar_url} 
                      alt={request.type === 'incoming' ? request.sender.full_name : request.receiver.full_name} 
                    />
                    <AvatarFallback>
                      {(request.type === 'incoming' ? request.sender.full_name : request.receiver.full_name)?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {request.type === 'incoming' ? request.sender.full_name : request.receiver.full_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {request.type === 'incoming' 
                        ? "Souhaite vous ajouter comme ami" 
                        : "Demande envoyée"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {request.type === 'incoming' ? (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          className="h-8 px-3"
                          onClick={() => handleAcceptRequest(request.id, request.sender.id, request.sender.full_name)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3"
                          onClick={() => handleRejectRequest(request.id, request.sender.full_name)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3"
                        onClick={() => handleCancelRequest(request.id, request.receiver.full_name)}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Friends List Section */}
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Mes connections
          </h3>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {friends?.map((friend: FriendPreview) => (
                <div 
                  key={friend.id} 
                  className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors group relative cursor-pointer"
                  onClick={() => handleViewFriendProfile(friend)}
                >
                  <Avatar className="h-10 w-10 border-2 border-primary/10">
                    <AvatarImage src={friend.avatar_url || ''} alt={friend.full_name || ''} />
                    <AvatarFallback>
                      {friend.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMessage(friend.id);
                    }}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {(!friends || friends.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aucun ami pour le moment</p>
                  <p className="text-sm">Commencez à ajouter des amis!</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </Card>

      {selectedProfile && (
        <ProfilePreview
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </>
  );
}
