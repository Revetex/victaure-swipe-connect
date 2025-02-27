
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { UserAvatar } from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/profile';
import { MessageSquare, UserMinus, User, PhoneCall } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useReceiver } from '@/hooks/useReceiver';
import { format, formatDistanceToNow, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

export function FriendsList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setReceiver, setShowConversation } = useReceiver();
  const [activeTab, setActiveTab] = useState('all');

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ['friends', user?.id],
    queryFn: async () => {
      if (!user) return [];

      try {
        // Au lieu d'utiliser la relation qui cause l'erreur, faisons deux requêtes séparées
        // D'abord, récupérons les connexions de l'utilisateur
        const { data: connections, error: connectionsError } = await supabase
          .from('user_connections')
          .select('id, sender_id, receiver_id, status, connection_type')
          .eq('status', 'accepted')
          .eq('connection_type', 'friend')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

        if (connectionsError) {
          console.error("Error loading connections:", connectionsError);
          return [];
        }

        if (!connections || connections.length === 0) return [];

        // Maintenant, récupérons les profils correspondants
        const friendsProfiles = [];
        
        for (const connection of connections) {
          const friendId = connection.sender_id === user.id ? connection.receiver_id : connection.sender_id;
          
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', friendId)
            .single();
          
          if (profileError) {
            console.error(`Error fetching profile for ${friendId}:`, profileError);
            continue;
          }
          
          if (!profileData) continue;

          // Créer un profil complet
          const profile: UserProfile = {
            id: profileData.id,
            full_name: profileData.full_name || '',
            avatar_url: profileData.avatar_url || null,
            email: profileData.email || '',
            role: profileData.role || 'professional',
            bio: profileData.bio || '',
            phone: profileData.phone || '',
            city: profileData.city || '',
            state: profileData.state || '',
            country: profileData.country || '',
            skills: profileData.skills || [],
            online_status: !!profileData.online_status,
            last_seen: profileData.last_seen || null,
            created_at: profileData.created_at || new Date().toISOString(),
            friends: [] // Propriété obligatoire
          };
          
          friendsProfiles.push(profile);
        }

        return friendsProfiles;
      } catch (error) {
        console.error('Error fetching friends:', error);
        return [];
      }
    },
    enabled: !!user
  });

  const handleMessageClick = (friend: UserProfile) => {
    setReceiver({
      id: friend.id,
      full_name: friend.full_name,
      avatar_url: friend.avatar_url,
      online_status: friend.online_status
    });
    setShowConversation(true);
    navigate('/messages');
  };

  const handleProfileClick = (friendId: string) => {
    navigate(`/profile/${friendId}`);
  };

  const getLastSeenText = (friend: UserProfile) => {
    if (friend.online_status) return "En ligne";
    if (!friend.last_seen) return "Hors ligne";
    
    try {
      const lastSeenDate = new Date(friend.last_seen);
      if (isToday(lastSeenDate)) {
        return formatDistanceToNow(lastSeenDate, { addSuffix: true, locale: fr });
      }
      return format(lastSeenDate, 'dd MMM à HH:mm', { locale: fr });
    } catch {
      return "Hors ligne";
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Chargement...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Mes amis</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="online">En ligne</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {friends.length === 0 ? (
        <div className="text-center p-8 bg-background/50 rounded-lg border">
          <p className="text-muted-foreground">Vous n'avez pas encore d'amis.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/friends/discover')}>
            Trouver des amis
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {friends
            .filter(friend => activeTab === 'all' || friend.online_status)
            .map(friend => (
              <div key={friend.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border">
                <div className="flex items-center space-x-3" onClick={() => handleProfileClick(friend.id)} style={{ cursor: 'pointer' }}>
                  <div className="relative">
                    <UserAvatar user={{ id: friend.id, name: friend.full_name || '', image: friend.avatar_url || '' }} />
                    {friend.online_status && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{friend.full_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {getLastSeenText(friend)}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleMessageClick(friend)}>
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <span className="sr-only">Plus d'options</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleProfileClick(friend.id)}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Voir le profil</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleMessageClick(friend)}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Envoyer un message</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <PhoneCall className="mr-2 h-4 w-4" />
                        <span>Appeler</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <UserMinus className="mr-2 h-4 w-4" />
                        <span>Retirer des amis</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
