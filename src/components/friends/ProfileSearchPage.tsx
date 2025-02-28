
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { friendRequestsAdapter } from "@/utils/connectionAdapters";

export function ProfileSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Récupérer l'utilisateur courant
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    }
  });
  
  // Rechercher des utilisateurs
  const { data: searchResults = [], refetch } = useQuery({
    queryKey: ["search-profiles", searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 3) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, role')
        .neq('id', currentUser?.id)
        .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .limit(10);
      
      if (error) {
        console.error('Search error:', error);
        return [];
      }
      
      return data;
    },
    enabled: searchTerm.length >= 3
  });
  
  // Vérifier qui est déjà ami ou a une demande en attente
  const { data: connectionStatus = {} } = useQuery({
    queryKey: ["connection-status", searchResults.map(p => p.id).join('-')],
    queryFn: async () => {
      if (!currentUser || searchResults.length === 0) return {};
      
      // Récupérer toutes les connexions pour ces utilisateurs
      const { data: connections, error } = await supabase
        .from('user_connections')
        .select('sender_id, receiver_id, status')
        .or(
          searchResults.map(profile => 
            `and(sender_id.eq.${currentUser.id},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${currentUser.id})`
          ).join(',')
        );
      
      if (error) {
        console.error('Error fetching connections:', error);
        return {};
      }
      
      // Créer un objet avec le statut de connexion pour chaque profil
      const statusMap = {};
      
      searchResults.forEach(profile => {
        const connectionWithProfile = connections?.filter(c => 
          (c.sender_id === currentUser.id && c.receiver_id === profile.id) ||
          (c.sender_id === profile.id && c.receiver_id === currentUser.id)
        );
        
        if (connectionWithProfile && connectionWithProfile.length > 0) {
          const acceptedConn = connectionWithProfile.find(c => c.status === 'accepted');
          const pendingConn = connectionWithProfile.find(c => c.status === 'pending');
          
          if (acceptedConn) {
            statusMap[profile.id] = 'connected';
          } else if (pendingConn) {
            const sentByMe = pendingConn.sender_id === currentUser.id;
            statusMap[profile.id] = sentByMe ? 'pending_sent' : 'pending_received';
          }
        } else {
          statusMap[profile.id] = 'none';
        }
      });
      
      return statusMap;
    },
    enabled: searchResults.length > 0 && !!currentUser
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.length >= 3) {
      refetch();
    } else {
      toast.error("Veuillez entrer au moins 3 caractères");
    }
  };
  
  const handleConnect = async (profileId: string) => {
    if (!currentUser) return;
    
    try {
      const { error } = await friendRequestsAdapter.createFriendRequest(currentUser.id, profileId);
      
      if (error) throw error;
      
      toast.success("Demande de connexion envoyée");
      refetch();
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast.error("Erreur lors de l'envoi de la demande");
    }
  };
  
  const handleAcceptRequest = async (profileId: string) => {
    if (!currentUser) return;
    
    try {
      // Trouver l'ID de la demande
      const { data: pending } = await supabase
        .from('user_connections')
        .select('id')
        .eq('sender_id', profileId)
        .eq('receiver_id', currentUser.id)
        .eq('status', 'pending')
        .maybeSingle();
      
      if (!pending) {
        toast.error("Demande non trouvée");
        return;
      }
      
      const { error } = await friendRequestsAdapter.acceptFriendRequest(pending.id);
      
      if (error) throw error;
      
      toast.success("Demande acceptée");
      refetch();
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error("Erreur lors de l'acceptation de la demande");
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Rechercher des profils</h1>
      
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <Input 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher par nom ou email..."
          className="flex-1"
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
      </form>
      
      {searchResults.length === 0 && searchTerm.length >= 3 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucun résultat trouvé pour "{searchTerm}"</p>
        </div>
      )}
      
      <div className="space-y-4">
        {searchResults.map(profile => (
          <div 
            key={profile.id} 
            className="flex items-center justify-between p-4 bg-card rounded-lg shadow"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>{profile.full_name[0]}</AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="font-medium">{profile.full_name}</h3>
                <p className="text-sm text-muted-foreground">{profile.role || "Professionnel"}</p>
              </div>
            </div>
            
            <div>
              {connectionStatus[profile.id] === 'connected' && (
                <Button variant="outline" disabled>
                  Connecté
                </Button>
              )}
              
              {connectionStatus[profile.id] === 'pending_sent' && (
                <Button variant="outline" disabled>
                  Demande envoyée
                </Button>
              )}
              
              {connectionStatus[profile.id] === 'pending_received' && (
                <Button onClick={() => handleAcceptRequest(profile.id)}>
                  Accepter la demande
                </Button>
              )}
              
              {connectionStatus[profile.id] === 'none' && (
                <Button onClick={() => handleConnect(profile.id)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Connecter
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
