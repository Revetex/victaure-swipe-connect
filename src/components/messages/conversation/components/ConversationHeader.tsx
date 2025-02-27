
import { Receiver } from "@/types/messages";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MoreHorizontal, Phone, VideoIcon } from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/components/ThemeProvider";
import { useIsMobile } from "@/hooks/use-mobile";

interface ConversationHeaderProps {
  receiver: Receiver | null;
  onBack: () => void;
}

export function ConversationHeader({ receiver, onBack }: ConversationHeaderProps) {
  const { isDark } = useThemeContext();
  const isMobile = useIsMobile();

  if (!receiver) return null;

  const formatLastSeen = (date: string | null) => {
    if (!date) return "Hors ligne";
    return `Vu ${format(new Date(date), "HH:mm")}`;
  };
  
  return (
    <div className={cn(
      "flex items-center gap-2 p-3 border-b",
      "transition-colors duration-300 ease-in-out",
      isDark 
        ? "bg-[#1A1F2C]/90 backdrop-blur-sm border-[#64B5D9]/10" 
        : "bg-white/90 backdrop-blur-sm border-slate-200"
    )}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onBack}
        className={cn(
          "mr-1 rounded-full",
          isDark 
            ? "text-white/80 hover:text-white hover:bg-white/10" 
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <UserAvatar 
        user={{ 
          id: receiver.id, 
          image: receiver.avatar_url, 
          name: receiver.full_name
        }} 
        className="h-9 w-9" 
      />
      
      <div className="flex-1 min-w-0">
        <h2 className={cn(
          "font-medium truncate",
          isDark ? "text-white" : "text-slate-900"
        )}>
          {receiver.full_name}
        </h2>
        <p className={cn(
          "text-xs", 
          isDark 
            ? receiver.online_status === "online" ? "text-green-400" : "text-gray-400" 
            : receiver.online_status === "online" ? "text-green-600" : "text-slate-500"
        )}>
          {receiver.online_status === "online" 
            ? "En ligne" 
            : formatLastSeen(receiver.last_seen)}
        </p>
      </div>

      {!isMobile && (
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "rounded-full",
              isDark 
                ? "text-white/80 hover:text-white hover:bg-white/10" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "rounded-full",
              isDark 
                ? "text-white/80 hover:text-white hover:bg-white/10" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}
          >
            <VideoIcon className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "rounded-full",
              isDark 
                ? "text-white/80 hover:text-white hover:bg-white/10" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "rounded-full ml-1",
            isDark 
              ? "text-white/80 hover:text-white hover:bg-white/10" 
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
