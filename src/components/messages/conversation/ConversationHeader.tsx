
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Receiver } from "@/types/messages";

interface ConversationHeaderProps {
  profile: Receiver | null;
  onBack?: () => void;
  onDeleteConversation?: () => void;
}

export function ConversationHeader({
  profile,
  onBack,
  onDeleteConversation
}: ConversationHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-lg font-medium text-primary">
                  {profile?.full_name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {profile?.online_status && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
            )}
          </div>
          <div>
            <h3 className="font-medium">{profile?.full_name}</h3>
            <p className="text-sm text-muted-foreground">
              {profile?.online_status ? "En ligne" : "Hors ligne"}
            </p>
          </div>
        </div>
      </div>

      {onDeleteConversation && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDeleteConversation}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
