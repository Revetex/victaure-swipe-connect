
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { Receiver } from "@/types/messages";

interface ConversationHeaderProps {
  receiver: Receiver | null;
  onBack: () => void;
}

export function ConversationHeader({ receiver, onBack }: ConversationHeaderProps) {
  return (
    <div className="flex items-center gap-3 p-4 border-b pt-20">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      
      {receiver && (
        <div className="flex items-center gap-3">
          <UserAvatar
            user={{
              ...receiver,
              online_status: receiver.online_status === 'online',
              friends: []
            }}
            className="h-10 w-10"
          />
          <div>
            <p className="font-medium">{receiver.full_name}</p>
            <p className="text-sm text-muted-foreground">
              {receiver.online_status === 'online' ? 'En ligne' : 'Hors ligne'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
