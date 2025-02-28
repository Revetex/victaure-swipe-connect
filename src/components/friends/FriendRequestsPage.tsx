
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, Clock, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { friendRequestsAdapter } from "@/utils/connectionAdapters";

export function FriendRequestsPage() {
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    }
  });
  
  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ["friend-requests", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      
      const { data: connections, error } = await friendRequestsAdapter.findPendingRequests(currentUser.id);
      
      if (error) {
        console.error('Error fetching requests:', error);
        return [];
      }
      
      if (!connections) return [];
      
      return connections.map(request => {
        const isIncoming = request.receiver_id === currentUser.id;
        const otherPerson = isIncoming ? request.sender : request.receiver;
        
        if (!otherPerson) {
          return {
            id: request.id,
            type: isIncoming ? 'incoming' : 'outgoing',
            userId: isIncoming ? request.sender_id : request.receiver_id,
            userName: "Utilisateur inconnu",
            userAvatar: "",
            createdAt: request.created_at
          };
        }
        
        return {
          id: request.id,
          type: isIncoming ? 'incoming' : 'outgoing',
          userId: otherPerson.id,
          userName: otherPerson.full_name || "Utilisateur",
          userAvatar: otherPerson.avatar_url || "",
          createdAt: request.created_at
        };
      });
    },
    enabled: !!currentUser
  });
  
  const handleAccept = async (requestId: string, userName: string) => {
    try {
      const { error } = await friendRequestsAdapter.acceptFriendRequest(requestId);
      
      if (error) throw error;
      
      toast.success(`Vous êtes maintenant ami avec ${userName}`);
      refetch();
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error("Erreur lors de l'acceptation de la demande");
    }
  };
  
  const handleReject = async (requestId: string) => {
    try {
      const { error } = await friendRequestsAdapter.deleteFriendRequest(requestId);
      
      if (error) throw error;
      
      toast.success("Demande rejetée");
      refetch();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error("Erreur lors du rejet de la demande");
    }
  };
  
  const handleCancel = async (requestId: string) => {
    try {
      const { error } = await friendRequestsAdapter.deleteFriendRequest(requestId);
      
      if (error) throw error;
      
      toast.success("Demande annulée");
      refetch();
    } catch (error) {
      console.error('Error canceling request:', error);
      toast.error("Erreur lors de l'annulation de la demande");
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Demandes d'amis</h1>
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  // Séparer les demandes entrantes et sortantes
  const incomingRequests = requests.filter(r => r.type === 'incoming');
  const outgoingRequests = requests.filter(r => r.type === 'outgoing');

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Demandes d'amis</h1>
      
      {requests.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Aucune demande en attente</h2>
          <p className="text-muted-foreground">Vous n'avez pas de demandes d'amis en attente</p>
        </div>
      ) : (
        <div className="space-y-8">
          {incomingRequests.length > 0 && (
            <div>
              <h2 className="text-xl font-medium mb-4">Demandes reçues ({incomingRequests.length})</h2>
              <div className="space-y-4">
                {incomingRequests.map(request => (
                  <div 
                    key={request.id}
                    className="bg-card p-4 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={request.userAvatar} />
                        <AvatarFallback>{request.userName[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-medium">{request.userName}</h3>
                        <p className="text-xs text-muted-foreground">
                          Demande reçue le {format(new Date(request.createdAt), 'PPP', {locale: fr})}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="default"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleAccept(request.id, request.userName)}
                      >
                        <Check className="h-4 w-4" />
                        Accepter
                      </Button>
                      
                      <Button 
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleReject(request.id)}
                      >
                        <X className="h-4 w-4" />
                        Refuser
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {outgoingRequests.length > 0 && (
            <div>
              <h2 className="text-xl font-medium mb-4">Demandes envoyées ({outgoingRequests.length})</h2>
              <div className="space-y-4">
                {outgoingRequests.map(request => (
                  <div 
                    key={request.id}
                    className="bg-card p-4 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={request.userAvatar} />
                        <AvatarFallback>{request.userName[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-medium">{request.userName}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>En attente depuis {format(new Date(request.createdAt), 'PPP', {locale: fr})}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleCancel(request.id)}
                    >
                      <X className="h-4 w-4" />
                      Annuler
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
