
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";

interface ConversationItemProps {
  name: string;
  avatarUrl: string | null;
  lastMessage: string | null;
  time: string | null;
  unreadCount: number;
  isOnline: boolean;
  onClick: () => void;
}

export function ConversationItem({
  name,
  avatarUrl,
  lastMessage,
  time,
  unreadCount,
  isOnline,
  onClick
}: ConversationItemProps) {
  // Formater le temps
  const formatMessageTime = (timestamp: string) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, "HH:mm");
    } else if (isYesterday(date)) {
      return "Hier";
    } else if (isThisWeek(date)) {
      return format(date, "EEEE", { locale: fr });
    } else {
      return format(date, "dd/MM/yyyy");
    }
  };

  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(26, 35, 53, 0.7)" }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 cursor-pointer transition-colors rounded-lg",
        unreadCount > 0 ? "bg-[#1A2335]/50" : "hover:bg-[#1A2335]/30"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <Avatar className="h-12 w-12 border border-[#64B5D9]/20">
          <AvatarImage src={avatarUrl || ""} />
          <AvatarFallback className="bg-[#1A2335] text-[#64B5D9]">
            {name.split(" ").map((n) => n[0]).join("").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#1B2A4A]" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className={cn(
            "font-medium truncate",
            unreadCount > 0 ? "text-[#F2EBE4]" : "text-[#F2EBE4]/80"
          )}>
            {name}
          </h3>
          <span className="text-xs text-[#F2EBE4]/50 mt-0.5 whitespace-nowrap">
            {time ? formatMessageTime(time) : ""}
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <p className={cn(
            "text-sm truncate mr-2",
            unreadCount > 0 ? "text-[#F2EBE4]" : "text-[#F2EBE4]/60"
          )}>
            {lastMessage || "Démarrer une conversation"}
          </p>
          
          {unreadCount > 0 && (
            <Badge className="bg-[#64B5D9] text-[#1E293B] text-xs h-5 min-w-5 flex items-center justify-center rounded-full px-1.5">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}
