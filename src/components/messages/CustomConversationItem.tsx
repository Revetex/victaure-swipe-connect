
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCheck, ChevronRight, Pin, VolumeOff } from "lucide-react";

interface CustomConversationItemProps {
  avatar?: string;
  name: string;
  message?: string;
  time?: string;
  isActive?: boolean;
  unread?: number;
  online?: boolean;
  onClick?: () => void;
  isPinned?: boolean;
  isMuted?: boolean;
}

export function CustomConversationItem({ 
  avatar, 
  name, 
  message, 
  time, 
  isActive, 
  unread = 0, 
  online,
  onClick,
  isPinned = false,
  isMuted = false
}: CustomConversationItemProps) {
  
  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    
    const date = new Date(timeString);
    
    if (isToday(date)) {
      return format(date, "HH:mm");
    } else if (isYesterday(date)) {
      return "Hier";
    } else {
      return format(date, "dd/MM");
    }
  };
  
  const displayTime = formatTime(time);
  
  // Truncate name et message si trop long
  const truncatedName = name.length > 18 ? name.substring(0, 15) + "..." : name;
  const truncatedMessage = message && message.length > 30 
    ? message.substring(0, 27) + "..." 
    : message;

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start px-2 py-6 h-auto rounded-lg",
        isActive && "bg-accent",
        "transition-all duration-200"
      )}
      onClick={onClick}
    >
      <div className="flex w-full items-center">
        <div className="relative mr-2">
          <Avatar>
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          {online && (
            <span className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="font-medium text-foreground truncate flex items-center gap-1">
              {truncatedName}
              {isPinned && <Pin className="h-3 w-3 text-muted-foreground" />}
            </div>
            <div className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
              {isMuted && <VolumeOff className="h-3 w-3" />}
              {displayTime}
            </div>
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <div className="text-sm text-muted-foreground truncate flex items-center">
              {message && message.startsWith("Vous: ") ? (
                <CheckCheck className="h-3 w-3 mr-1 inline" />
              ) : null}
              {truncatedMessage}
            </div>
            <div className="flex items-center">
              {unread > 0 ? (
                <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] leading-3 text-primary-foreground">
                  {unread}
                </span>
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-70" />
              )}
            </div>
          </div>
        </div>
      </div>
    </Button>
  );
}
