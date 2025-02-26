
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFriendsList } from "../hooks/useFriendsList";
import { Receiver } from "@/types/messages";
import { Loader2 } from "lucide-react";
import { useReceiver } from "@/hooks/useReceiver";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NewConversationPopoverProps {
  onSelectFriend: () => void;
}

export function NewConversationPopover({ onSelectFriend }: NewConversationPopoverProps) {
  const { friends, loading } = useFriendsList();
  const { setReceiver } = useReceiver();

  const handleSelectFriend = (friend: Receiver) => {
    setReceiver(friend);
    onSelectFriend();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <MessageSquarePlus className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Nouvelle conversation</h4>
          <ScrollArea className="h-[300px] pr-4">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : friends.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun ami trouvé
              </p>
            ) : (
              <div className="space-y-2">
                {friends.map((friend) => (
                  <Button
                    key={friend.id}
                    variant="ghost"
                    className="w-full justify-start gap-2 p-2"
                    onClick={() => handleSelectFriend(friend)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={friend.avatar_url || undefined} />
                      <AvatarFallback>
                        {friend.full_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{friend.full_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {friend.online_status === 'online' ? 'En ligne' : 'Hors ligne'}
                      </span>
                    </div>
                    <div className="ml-auto">
                      <div className={`h-2 w-2 rounded-full ${
                        friend.online_status === 'online' 
                          ? 'bg-green-500' 
                          : 'bg-gray-300'
                      }`} />
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
