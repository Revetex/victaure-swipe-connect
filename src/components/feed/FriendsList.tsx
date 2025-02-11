
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserCircle, MessageCircle, Loader2 } from "lucide-react";
import { ProfileNameButton } from "@/components/profile/ProfileNameButton";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { ProfileSearch } from "./ProfileSearch";
import { FriendRequestsSection } from "./friends/FriendRequestsSection";
import { UserProfile } from "@/types/profile";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

export function FriendsList() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const isMobile = useIsMobile();

  const { data: friends, isLoading, isError } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: acceptedRequests, error } = await supabase
        .from("friend_requests")
        .select(`
          sender:profiles!friend_requests_sender_id_fkey(id, full_name, avatar_url, online_status, last_seen),
          receiver:profiles!friend_requests_receiver_id_fkey(id, full_name, avatar_url, online_status, last_seen)
        `)
        .eq("status", "accepted")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (error) {
        console.error("Error fetching friends:", error);
        throw error;
      }

      return acceptedRequests?.map(request => {
        const friend = request.sender.id === user.id ? request.receiver : request.sender;
        return friend;
      }) || [];
    },
    staleTime: 1000 * 60,
    refetchInterval: 30000
  });

  const handleProfileSelect = async (profile: UserProfile) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: existingRequest } = await supabase
      .from("friend_requests")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${user.id})`)
      .maybeSingle();

    if (existingRequest) {
      toast.error("Une demande d'ami existe déjà avec ce profil");
      return;
    }

    try {
      const { error } = await supabase
        .from("friend_requests")
        .insert({
          sender_id: user.id,
          receiver_id: profile.id,
          status: "pending"
        });

      if (error) throw error;
      toast.success("Demande d'ami envoyée avec succès");
      setSelectedProfile(null);
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Erreur lors de l'envoi de la demande d'ami");
    }
  };

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
    return (
      <div className="p-4 text-center text-red-500">
        Erreur lors du chargement de vos connections
      </div>
    );
  }

  return (
    <div className={cn(
      "container mx-auto max-w-4xl px-4",
      isMobile ? "pt-4" : "pt-20"
    )}>
      <Card className="p-6 space-y-8">
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

        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Mes connections
          </h3>
          
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : friends?.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Aucune connection pour le moment
            </p>
          ) : (
            <ScrollArea className={cn(
              "pr-4",
              isMobile ? "h-[calc(100vh-20rem)]" : "h-[400px]"
            )}>
              <AnimatePresence>
                <div className="space-y-3">
                  {friends?.map((friend) => (
                    <motion.div
                      key={friend.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center justify-between gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                          {friend.avatar_url ? (
                            <img
                              src={friend.avatar_url}
                              alt={friend.full_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserCircle className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <ProfileNameButton 
                            profile={friend}
                            className="p-0 h-auto font-medium hover:underline"
                          />
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span className={`h-2 w-2 rounded-full ${friend.online_status ? 'bg-green-500' : 'bg-gray-300'}`} />
                            {friend.online_status ? 'En ligne' : 'Hors ligne'}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/messages?receiver=${friend.id}`)}
                        className="ml-auto"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </ScrollArea>
          )}
        </div>
      </Card>
    </div>
  );
}
