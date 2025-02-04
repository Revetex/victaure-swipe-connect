import { Message, Receiver } from "@/types/messages";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, MessageCircle, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatTimestamp } from "@/utils/dateUtils";
import { ChatScroll } from "@/components/chat/ChatScroll";

interface MessagesListProps {
  messages: Message[];
  chatMessages: Message[];
  onSelectConversation: (type: "assistant" | "user", receiver?: Receiver) => void;
}

export function MessagesList({
  messages,
  chatMessages,
  onSelectConversation
}: MessagesListProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <ChatScroll>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4 p-4"
      >
        <motion.div
          variants={item}
          className={cn(
            "p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors cursor-pointer",
            "group relative overflow-hidden"
          )}
          onClick={() => onSelectConversation("assistant")}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-primary/10">
              <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" />
              <AvatarFallback>
                <Bot className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-1">
                M. Victaure
              </h3>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Assistant IA
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </ChatScroll>
  );
}