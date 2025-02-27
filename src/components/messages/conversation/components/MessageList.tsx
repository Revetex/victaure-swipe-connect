
import { Message } from "@/types/messages";
import { MessageBubble } from "./MessageBubble";
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { useThemeContext } from "@/components/ThemeProvider";

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  onDeleteMessage: (id: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function MessageList({ 
  messages, 
  currentUserId,
  onDeleteMessage,
  messagesEndRef
}: MessageListProps) {
  const { isDark } = useThemeContext();
  
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className={cn(
          "text-center p-6 rounded-lg max-w-md mx-auto",
          isDark ? "bg-[#1A1F2C]/80 text-white/80" : "bg-slate-100 text-slate-500"
        )}>
          <p className="mb-2 text-lg font-medium">Aucun message</p>
          <p className="text-sm">
            Commencez la conversation en envoyant un message ci-dessous.
          </p>
        </div>
      </div>
    );
  }

  // Grouper les messages par date
  const groupedMessages: { [date: string]: Message[] } = {};
  
  messages.forEach(message => {
    const date = new Date(message.created_at).toLocaleDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return (
    <div className="space-y-6">
      {Object.entries(groupedMessages).map(([date, messagesForDate]) => (
        <div key={date} className="space-y-4">
          <div className="flex justify-center">
            <div className={cn(
              "px-3 py-1 rounded-full text-xs",
              isDark 
                ? "bg-[#1A1F2C]/80 text-white/70" 
                : "bg-slate-100 text-slate-600"
            )}>
              {format(new Date(date), "EEEE d MMMM", { locale: fr })}
            </div>
          </div>
          
          {messagesForDate.map((message, index) => (
            <motion.div 
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
            >
              <MessageBubble 
                message={message}
                isCurrentUser={message.sender_id === currentUserId}
                onDelete={() => onDeleteMessage(message.id)}
              />
            </motion.div>
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
