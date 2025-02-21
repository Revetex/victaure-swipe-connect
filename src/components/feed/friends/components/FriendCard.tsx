
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface FriendCardProps {
  friend: UserProfile;
}

export function FriendCard({ friend }: FriendCardProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={friend.avatar_url || "/user-icon.svg"}
            alt={friend.full_name || "User"}
            className="h-10 w-10 rounded-full object-cover"
          />
          {friend.online_status && (
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-zinc-900" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{friend.full_name}</p>
          <p className="text-xs text-zinc-400">{friend.role}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-zinc-400 hover:text-white hover:bg-zinc-800"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    </div>
  );
}
