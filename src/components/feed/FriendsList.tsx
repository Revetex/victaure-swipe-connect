import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User, UserPlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { UserProfile } from "@/types/profile";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { useState } from "react";
import { ProfilePreview } from "@/components/ProfilePreview";
import { FriendItem } from "./friends/FriendItem";
import { PendingRequest } from "./friends/PendingRequest";
import { FriendListHeader } from "./friends/FriendListHeader";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function FriendsList() {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const isMobile = useIsMobile();
  
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
        return {
          id: friend.id,
          full_name: friend.full_name,
          avatar_url: friend.avatar_url,
          online_status: friend.online_status,
          last_seen: friend.last_seen
        };
      }) || [];
    }
  });

  const { data: pendingRequests = [], refetch: refetchPendingRequests } = useQuery({
    queryKey: ["pending-requests"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

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

      return [...formattedIncoming, ...formattedOutgoing];
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

  const FriendsListContent = () => (
    <Card className="p-4 bg-card/50 backdrop-blur-sm h-full">
      <div className="mb-6">
        <ProfileSearch 
          onSelect={handleProfileSelect}
          placeholder="Rechercher quelqu'un..."
        />
      </div>

      <div className="mb-6">
        <FriendListHeader 
          icon={<UserPlus className="h-5 w-5 text-primary" />}
          title="Demandes en attente"
        />
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <PendingRequest
                key={request.id}
                request={request}
                onAccept={handleAcceptRequest}
                onReject={handleRejectRequest}
                onCancel={handleCancelRequest}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      <div>
        <FriendListHeader 
          icon={<User className="h-5 w-5 text-primary" />}
          title="Mes connections"
        />
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {friends?.map((friend) => (
              <FriendItem
                key={friend.id}
                friend={friend}
                onMessage={handleMessage}
                onViewProfile={() => setSelectedProfile({
                  ...friend,
                  email: '',
                  role: 'professional',
                  bio: null,
                  phone: null,
                  city: null,
                  state: null,
                  country: 'Canada',
                  skills: [],
                  latitude: null,
                  longitude: null
                })}
              />
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
  );

  if (isMobile) {
    return (
      <>
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="fixed bottom-24 right-4 z-50 rounded-full shadow-lg"
            >
              <User className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
            <FriendsListContent />
          </SheetContent>
        </Sheet>

        {selectedProfile && (
          <ProfilePreview
            profile={selectedProfile}
            onClose={() => setSelectedProfile(null)}
          />
        )}
      </>
    );
  }

  return (
    <div className="w-[300px] fixed left-0 top-16 bottom-0 p-4 overflow-hidden">
      <FriendsListContent />
      {selectedProfile && (
        <ProfilePreview
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
}
