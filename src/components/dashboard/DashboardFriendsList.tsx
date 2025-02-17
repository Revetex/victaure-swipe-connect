
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { UserAvatar } from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export interface DashboardFriendsListProps {
  show: boolean;
  onClose: () => void;
}

export function DashboardFriendsList({ show, onClose }: DashboardFriendsListProps) {
  const { profile } = useProfile();

  const getLastSeenText = (lastSeen: string) => {
    return formatDistanceToNow(new Date(lastSeen), { addSuffix: true, locale: fr });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Amis en ligne</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile?.friends && profile.friends.length > 0 ? (
          <div className="space-y-3">
            {profile.friends.slice(0, 5).map((friend) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <UserAvatar
                  imageUrl={friend.avatar_url}
                  name={friend.full_name}
                  className="h-8 w-8"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{friend.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {friend.online_status ? "En ligne" : friend.last_seen ? getLastSeenText(friend.last_seen) : "Hors ligne"}
                  </p>
                </div>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  friend.online_status ? "bg-green-500" : "bg-gray-300"
                )} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            <p>Aucun ami en ligne pour le moment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
