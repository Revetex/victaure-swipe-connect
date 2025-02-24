
import { Message } from "@/types/messages";
import { UserAvatar } from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { speaker } from "@/utils/speaker";
import { Button } from "@/components/ui/button";
import { Speaker } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  const handleSpeak = () => {
    speaker.speak(message.content);
  };

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
        "flex flex-col gap-1 max-w-[70%] relative group",
        isOwn && "items-end"
      )}>
        <div className={cn(
          "rounded-lg px-3 py-2 shadow-[0_0_0_1px_rgba(100,181,217,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]",
          isOwn 
            ? "bg-[#64B5D9] text-[#F2EBE4] border border-[#64B5D9]/30" 
            : "bg-[#1B2A4A]/80 border border-[#64B5D9]/20 text-[#F2EBE4]"
        )}>
          <p className="text-sm">{message.content}</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSpeak}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity",
              isOwn ? "-left-8" : "-right-8",
              "h-6 w-6 rounded-full bg-[#1B2A4A]/50 hover:bg-[#1B2A4A]/70"
            )}
          >
            <Speaker className="h-3 w-3 text-[#F2EBE4]" />
          </Button>
        </div>
        
        <span className="text-xs text-[#F2EBE4]/60">
          {format(new Date(message.created_at), "HH:mm", { locale: fr })}
        </span>
      </div>
    </motion.div>
  );
}
