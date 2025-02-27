import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { useFriendsList } from "@/components/messages/conversation/hooks/useFriendsList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/UserAvatar";
import { UserProfile } from "@/types/profile";
interface DashboardFriendsListProps {
  show: boolean;
  onClose: () => void;
}
export function DashboardFriendsList({
  show,
  onClose
}: DashboardFriendsListProps) {
  const {
    friends,
    loading
  } = useFriendsList();
  if (!show) return null;
  return <Card className="w-full max-w-md p-4 relative bg-white/5 backdrop-blur-md border-white/10">
      
      
      <div className="pt-8 py-0">
        <h2 className="text-2xl font-semibold mb-4 text-white">Mes amis</h2>
        
        <ScrollArea className="h-[300px] pr-4">
          {loading ? <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div> : friends.length > 0 ? <div className="space-y-4">
              {friends.map(friend => <div key={friend.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <UserAvatar user={{
              id: friend.id,
              email: friend.email || '',
              full_name: friend.full_name || 'Utilisateur',
              avatar_url: friend.avatar_url,
              certifications: [],
              education: [],
              experiences: [],
              friends: []
            }} className="h-10 w-10" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {friend.full_name || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-white/60">
                      {friend.online_status ? 'En ligne' : 'Hors ligne'}
                    </p>
                  </div>
                </div>)}
            </div> : <p className="text-white/60 text-center py-8">
              Aucun ami pour le moment
            </p>}
        </ScrollArea>
      </div>
    </Card>;
}