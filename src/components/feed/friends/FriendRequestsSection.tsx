import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PendingRequest } from "./PendingRequest";
import { toast } from "sonner";
import { UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FriendRequestsSection() {
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

  if (!pendingRequests.length) {
    return (
      <motion.div 
        className="text-center py-6 space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <UserCircle className="h-12 w-12 mx-auto text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          Aucune demande en attente
        </p>
      </motion.div>
    );
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <AnimatePresence>
        <div className="space-y-3">
          {pendingRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
            >
              <PendingRequest
                request={request}
                onAccept={handleAcceptRequest}
                onReject={handleRejectRequest}
                onCancel={handleCancelRequest}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </ScrollArea>
  );
}