
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
          "text-center p-8 rounded-xl max-w-sm mx-auto flex flex-col items-center",
          isDark 
            ? "bg-[#1A1F2C]/80 text-white/80 border border-[#64B5D9]/10" 
            : "bg-slate-100 text-slate-500 border border-slate-200"
        )}>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 20.29V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7.12a2 2 0 0 0-1.47.67l-2.65 3.2 0 0c-.12.13 0 .42.24.42h.26Z" 
                  className={cn(
                    "stroke-[#64B5D9] stroke-2 fill-none"
                  )} 
                />
                <path d="M8 9h8M8 13h4" className="stroke-[#64B5D9] stroke-2 fill-none stroke-linecap=round" />
              </svg>
            </motion.div>
          </div>
          <p className="mb-3 text-lg font-medium">Commencez la conversation</p>
          <p className="text-sm">
            Envoyez un message pour démarrer la discussion
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
    <div className="space-y-6 p-4">
      {Object.entries(groupedMessages).map(([date, messagesForDate]) => (
        <div key={date} className="space-y-4">
          <div className="flex justify-center">
            <div className={cn(
              "px-3 py-1 rounded-full text-xs",
              isDark 
                ? "bg-[#1A1F2C]/80 text-white/70 border border-[#64B5D9]/10" 
                : "bg-slate-100 text-slate-600 border border-slate-200"
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
