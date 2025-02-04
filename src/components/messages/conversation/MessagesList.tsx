import { Message } from "@/types/messages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCircle, MessageCircle, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface MessagesListProps {
  messages: Message[];
  chatMessages: Message[];
  onSelectConversation: (type: "assistant" | "user", receiver?: any) => void;
}

export function MessagesList({ messages, chatMessages, onSelectConversation }: MessagesListProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, "HH:mm", { locale: fr });
  };

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
    <ScrollArea className="h-[calc(100vh-8rem)] px-4">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4 py-4"
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
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-foreground">M. Victaure</h3>
                <span className="text-xs text-muted-foreground">Assistant IA</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                Votre assistant personnel
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {messages.map((message, index) => {
            const sender = typeof message.sender === 'string' ? { id: message.sender } : message.sender;
            const receiver = typeof message.receiver === 'string' ? { id: message.receiver } : message.receiver;
            const otherUser = sender.id === 'assistant' ? receiver : sender;

            if (!otherUser) return null;

            return (
              <motion.div
                key={message.id}
                variants={item}
                className={cn(
                  "p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors cursor-pointer",
                  "group relative overflow-hidden"
                )}
                onClick={() => onSelectConversation("user", otherUser)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/10">
                    <AvatarImage src={otherUser.avatar_url || undefined} />
                    <AvatarFallback>
                      <UserCircle className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">
                        {otherUser.full_name || "Utilisateur"}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {message.created_at && formatTimestamp(message.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground truncate">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </ScrollArea>
  );
}