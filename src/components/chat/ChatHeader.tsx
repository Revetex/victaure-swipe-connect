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
  isOnline?: boolean;
  lastSeen?: string;
}

export function ChatHeader({
  onBack,
  title = "M. Victor",
  subtitle = "Assistant de Placement Virtuel",
  avatarUrl = "/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png",
  isThinking = false,
  isOnline = true,
  lastSeen,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <motion.div
          animate={isThinking ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className="relative"
        >
          <Avatar className="h-10 w-10 ring-2 ring-primary/10">
            <AvatarImage src={avatarUrl} alt={title} className="object-cover" />
            <AvatarFallback className="bg-primary/20">
              <Bot className="h-4 w-4 text-primary" />
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
          )}
        </motion.div>
        <div>
          <h2 className="text-base font-semibold leading-none">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isThinking ? "En train de réfléchir..." : subtitle}
            {!isOnline && lastSeen && (
              <span className="text-xs ml-1">
                (Vu {new Date(lastSeen).toLocaleDateString('fr-FR')})
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}