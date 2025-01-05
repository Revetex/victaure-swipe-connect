import { Message } from "@/types/chat/messageTypes";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
}

export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {messages?.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex gap-3 ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender === "advisor" && (
              <Avatar className="h-8 w-8">
                <AvatarImage src="/victaure-avatar.png" alt="M. Victaure" />
                <AvatarFallback>MV</AvatarFallback>
              </Avatar>
            )}
            
            <div
              className={`rounded-lg p-4 max-w-[80%] ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.content}
            </div>

            {message.sender === "user" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {isTyping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-muted-foreground"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">M. Victaure réfléchit...</span>
        </motion.div>
      )}
    </div>
  );
}