import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserCircle, MessageCircle } from "lucide-react";
import { ProfileNameButton } from "@/components/profile/ProfileNameButton";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { ProfileSearch } from "./ProfileSearch";
import { FriendRequestsSection } from "./friends/FriendRequestsSection";
import { UserProfile } from "@/types/profile";

export function FriendsList() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const handleProfileSelect = async (profile: UserProfile) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check if a friend request already exists
    const { data: existingRequest } = await supabase
      .from("friend_requests")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${user.id})`)
      .maybeSingle();

    if (existingRequest) {
      toast.error("Une demande d'ami existe déjà avec ce profil");
      return;
    }

    // Send friend request
    const { error } = await supabase
      .from("friend_requests")
      .insert({
        sender_id: user.id,
        receiver_id: profile.id,
        status: "pending"
      });

    if (error) {
      console.error("Error sending friend request:", error);
      toast.error("Erreur lors de l'envoi de la demande d'ami");
      return;
    }

    toast.success("Demande d'ami envoyée avec succès");
    setSelectedProfile(null);
  };

  const { data: friends, isError } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: acceptedRequests, error } = await supabase
        .from("friend_requests")
        .select(`
          sender:profiles!friend_requests_sender_id_fkey(id, full_name, avatar_url, online_status),
          receiver:profiles!friend_requests_receiver_id_fkey(id, full_name, avatar_url, online_status)
        `)
        .eq("status", "accepted")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (error) {
        console.error("Error fetching friends:", error);
        throw error;
      }

      if (!acceptedRequests) return [];

      return acceptedRequests.map(request => {
        const friend = request.sender.id === user.id ? request.receiver : request.sender;
        return {
          ...friend,
          last_seen: new Date().toISOString()
        };
      });
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel('friend-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friend_requests'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['friends'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (isError) {
    toast.error("Erreur lors du chargement de vos connections");
    return null;
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Rechercher des profils</h2>
          <ProfileSearch 
            onSelect={handleProfileSelect}
            placeholder="Rechercher un profil..."
            className="w-full"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Demandes d'amis</h2>
          <FriendRequestsSection />
        </div>

        {friends?.length > 0 && (
          <div className="bg-card rounded-lg p-4 border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              Mes connections
            </h3>
            <AnimatePresence>
              <div className="space-y-3">
                {friends.map((friend) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center justify-between gap-2 p-2 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {friend.avatar_url ? (
                          <img
                            src={friend.avatar_url}
                            alt={friend.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserCircle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <ProfileNameButton 
                          profile={friend}
                          className="p-0 h-auto text-sm font-medium hover:underline"
                        />
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className={`h-2 w-2 rounded-full ${friend.online_status ? 'bg-green-500' : 'bg-gray-300'}`} />
                          {friend.online_status ? 'En ligne' : 'Hors ligne'}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/dashboard/messages?receiver=${friend.id}`)}
                      className="ml-auto"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
