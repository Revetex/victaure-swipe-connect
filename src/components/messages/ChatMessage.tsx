
import { Message } from "@/types/messages";
import { UserAvatar } from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "flex gap-3 mb-4",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}
    >
      <UserAvatar
        user={message.sender}
        className="h-8 w-8 flex-shrink-0"
      />
      <div className={cn(
        "flex flex-col gap-1 max-w-[70%]",
        isOwn && "items-end"
      )}>
        <div className={cn(
          "rounded-lg px-3 py-2",
          isOwn 
            ? "bg-[#64B5D9] text-[#F2EBE4]" 
            : "bg-[#1B2A4A]/80 border border-[#64B5D9]/20 text-[#F2EBE4]"
        )}>
          <p className="text-sm">{message.content}</p>
        </div>
        <span className="text-xs text-[#F2EBE4]/60">
          {format(new Date(message.created_at), "HH:mm", { locale: fr })}
        </span>
      </div>
    </motion.div>
  );
}
