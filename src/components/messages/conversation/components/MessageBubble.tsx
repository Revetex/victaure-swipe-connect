
import { Message } from "@/types/messages";
import { UserAvatar } from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, CheckCheck, Trash2, SmileIcon, Reply } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useThemeContext } from "@/components/ThemeProvider";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

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
  const [showReactions, setShowReactions] = useState(false);
  
  const messageTime = format(new Date(message.created_at), "HH:mm");
  const sender = message.sender;

  const statusIcon = {
    sent: <Check className="h-3 w-3 text-gray-400" />,
    delivered: <CheckCheck className="h-3 w-3 text-gray-400" />,
    read: <CheckCheck className="h-3 w-3 text-blue-500" />,
  };

  const reactions = ["👍", "❤️", "😊", "😂", "😮", "🙏"];

  return (
    <div className={cn(
      "flex items-end gap-2 max-w-[85%] group relative",
      isCurrentUser ? "ml-auto flex-row-reverse" : "mr-auto"
    )}>
      {!isCurrentUser && (
        <UserAvatar 
          user={{ 
            id: sender?.id || "", 
            name: sender?.full_name || "",
            image: sender?.avatar_url || ""
          }} 
          className="h-8 w-8 mt-1" 
        />
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={cn(
              "py-2 px-3 rounded-2xl max-w-[500px] break-words",
              isCurrentUser
                ? isDark 
                  ? "bg-gradient-to-r from-[#4A90E2] to-[#64B5D9] text-white" 
                  : "bg-gradient-to-r from-blue-500 to-blue-400 text-white"
                : isDark 
                  ? "bg-[#242F44] text-white" 
                  : "bg-white text-slate-900 border border-slate-200 shadow-sm",
              "hover:brightness-95 cursor-pointer transition-all"
            )}>
            <p className="whitespace-pre-wrap">{message.content}</p>
            <div className={cn(
              "flex items-center justify-end gap-1 text-xs mt-1",
              isCurrentUser 
                ? isDark ? "text-blue-100/70" : "text-blue-100/80" 
                : isDark ? "text-gray-400" : "text-gray-500"
            )}>
              <span>{messageTime}</span>
              {isCurrentUser && message.status && statusIcon[message.status as keyof typeof statusIcon]}
            </div>
          </motion.div>
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
          <DropdownMenuItem 
            onClick={() => setShowReactions(!showReactions)}
            className="cursor-pointer flex items-center gap-2"
          >
            <SmileIcon className="h-4 w-4" />
            <span>Réagir</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(message.content);
              toast.success("Message copié");
            }}
            className="cursor-pointer"
          >
            Copier le message
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => {
              toast.info("Fonction de réponse à venir");
            }}
            className="cursor-pointer flex items-center gap-2"
          >
            <Reply className="h-4 w-4" />
            <span>Répondre</span>
          </DropdownMenuItem>
          
          {isCurrentUser && (
            <>
              <DropdownMenuSeparator />
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
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {showReactions && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "absolute bottom-full mb-2",
            isCurrentUser ? "right-0" : "left-0",
            "flex bg-background border rounded-full p-1 shadow-lg"
          )}
        >
          {reactions.map(reaction => (
            <button
              key={reaction}
              className="hover:bg-accent rounded-full w-8 h-8 flex items-center justify-center text-lg"
              onClick={() => {
                toast.success(`Réaction ${reaction} ajoutée`);
                setShowReactions(false);
              }}
            >
              {reaction}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
