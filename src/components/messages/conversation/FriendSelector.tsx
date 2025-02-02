import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

interface FriendSelectorProps {
  onSelectFriend: (friendId: string) => void;
}

export function FriendSelector({ onSelectFriend }: FriendSelectorProps) {
  const { profile } = useProfile();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <UserPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sélectionner un ami</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {profile?.friends?.map((friend) => (
            <Button
              key={friend.id}
              onClick={() => onSelectFriend(friend.id)}
              variant="outline"
              className="w-full justify-start"
            >
              {friend.full_name}
            </Button>
          ))}
          {(!profile?.friends || profile.friends.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucun ami pour le moment
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}