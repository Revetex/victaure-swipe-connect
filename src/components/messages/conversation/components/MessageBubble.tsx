
import { Message } from "@/types/messages";
import { UserAvatar } from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, CheckCheck, Trash2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useThemeContext } from "@/components/ThemeProvider";

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  onDelete: () => void;
}

export function MessageBubble({ 
  message, 
  isCurrentUser,
  onDelete
}: MessageBubbleProps) {
  const { isDark } = useThemeContext();
  
  const messageTime = format(new Date(message.created_at), "HH:mm");
  const sender = message.sender;

  const statusIcon = {
    sent: <Check className="h-3 w-3 text-gray-400" />,
    delivered: <CheckCheck className="h-3 w-3 text-gray-400" />,
    read: <CheckCheck className="h-3 w-3 text-blue-500" />,
  };

  return (
    <div className={cn(
      "flex items-end gap-2 max-w-[85%]",
      isCurrentUser ? "ml-auto flex-row-reverse" : "mr-auto"
    )}>
      {!isCurrentUser && (
        <UserAvatar 
          user={{ 
            id: sender?.id, 
            image: sender?.avatar_url, 
            name: sender?.full_name 
          }} 
          className="h-8 w-8 mt-1" 
        />
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className={cn(
            "py-2 px-3 rounded-2xl max-w-[500px] break-words",
            isCurrentUser
              ? isDark 
                ? "bg-[#64B5D9] text-white" 
                : "bg-blue-500 text-white"
              : isDark 
                ? "bg-[#242F44] text-white" 
                : "bg-white text-slate-900 border border-slate-200",
            "hover:brightness-95 cursor-pointer transition-all"
          )}>
            <p className="whitespace-pre-wrap">{message.content}</p>
            <div className={cn(
              "flex items-center justify-end gap-1 text-xs mt-1",
              isCurrentUser 
                ? isDark ? "text-blue-100" : "text-blue-100" 
                : isDark ? "text-gray-400" : "text-gray-500"
            )}>
              <span>{messageTime}</span>
              {isCurrentUser && statusIcon[message.status as keyof typeof statusIcon]}
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align={isCurrentUser ? "end" : "start"}
          className={cn(
            "w-56",
            isDark 
              ? "bg-[#1A1F2C] text-white border-[#64B5D9]/20" 
              : "bg-white text-slate-900 border-slate-200"
          )}
        >
          {isCurrentUser && (
            <DropdownMenuItem 
              onClick={onDelete}
              className={cn(
                "cursor-pointer flex items-center gap-2",
                isDark 
                  ? "text-red-400 hover:text-red-300 hover:bg-red-500/10" 
                  : "text-red-600 hover:text-red-700 hover:bg-red-50"
              )}
            >
              <Trash2 className="h-4 w-4" />
              <span>Supprimer</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
