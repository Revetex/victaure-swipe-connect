
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { MoreHorizontal, ArrowLeft } from "lucide-react";
import { DeleteConversationDialog } from "./DeleteConversationDialog";
import { Badge } from "@/components/ui/badge";

interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  onBack?: () => void;
  onDelete?: () => Promise<void>;
  isOnline?: boolean;
  lastSeen?: string;
}

export function ChatHeader({
  title,
  subtitle,
  avatarUrl,
  onBack,
  onDelete,
  isOnline,
  lastSeen,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b mt-16 bg-background/95 backdrop-blur-sm z-50">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="lg:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-3">
          <div className="relative">
            <UserAvatar
              src={avatarUrl}
              fallback={title[0]}
              className="h-10 w-10"
            />
            {isOnline !== undefined && (
              <span
                className={cn(
                  "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                  isOnline ? "bg-green-500" : "bg-zinc-400"
                )}
              />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{title}</span>
              {title === "M. Victaure" && (
                <Badge variant="secondary" className="text-xs">
                  Assistant IA
                </Badge>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {isOnline
                ? "En ligne"
                : lastSeen
                ? `Vu ${formatDistanceToNow(new Date(lastSeen), {
                    addSuffix: true,
                    locale: fr,
                  })}`
                : subtitle}
            </span>
          </div>
        </div>
      </div>

      {onDelete && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DeleteConversationDialog onConfirm={onDelete} />
        </Dialog>
      )}
    </div>
  );
}
