
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
  onSelectFriend: (friend: any) => void;
  friends: Receiver[];
  loading: boolean;
  onClose: () => void;
}

export function NewConversationPopover({ onSelectFriend, friends, loading, onClose }: NewConversationPopoverProps) {
  return (
    <div className="bg-[#1A2335] border border-[#64B5D9]/20 rounded-lg shadow-lg p-3 mb-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-[#F2EBE4]">Nouvelle conversation</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0 text-[#F2EBE4]/70 hover:text-[#F2EBE4] hover:bg-[#64B5D9]/10"
          onClick={onClose}
        >
          <span className="sr-only">Fermer</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </Button>
      </div>
      
      <ScrollArea className="h-[220px] pr-3">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-[#64B5D9]" />
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-[#F2EBE4]/60 text-sm">
              Aucun contact trouvé
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1A2335]/70 cursor-pointer transition-colors"
                onClick={() => onSelectFriend(friend)}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 border border-[#64B5D9]/20">
                    <AvatarImage src={friend.avatar_url || ""} />
                    <AvatarFallback className="bg-[#1A2335] text-[#64B5D9]">
                      {friend.full_name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {friend.online_status === 'online' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#1B2A4A]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#F2EBE4] font-medium truncate">{friend.full_name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
