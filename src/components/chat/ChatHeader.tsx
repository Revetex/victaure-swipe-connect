import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot } from "lucide-react";
import { motion } from "framer-motion";

interface ChatHeaderProps {
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  avatarUrl?: string;
  isThinking?: boolean;
}

export function ChatHeader({
  onBack,
  title = "M. Victor",
  subtitle = "Assistant de Placement Virtuel",
  avatarUrl = "/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png",
  isThinking = false,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-1.5 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-1.5">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-6 w-6"
          >
            <ArrowLeft className="h-3 w-3" />
          </Button>
        )}
        <motion.div
          animate={isThinking ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className="relative"
        >
          <Avatar className="h-6 w-6 ring-1 ring-primary/10">
            <AvatarImage src={avatarUrl} alt={title} className="object-cover" />
            <AvatarFallback className="bg-primary/20">
              <Bot className="h-3 w-3 text-primary" />
            </AvatarFallback>
          </Avatar>
          {isThinking && (
            <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-green-500 ring-1 ring-white" />
          )}
        </motion.div>
        <div>
          <h2 className="text-sm font-semibold leading-none">{title}</h2>
          <p className="text-[10px] text-muted-foreground">
            {isThinking ? "En train de réfléchir..." : subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}