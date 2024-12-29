import { useEffect, useRef } from "react";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { format, isToday, isYesterday } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

interface ChatConversationProps {
  messagesByDate: Record<string, any[]>;
  currentUser: any;
  isThinking: boolean;
}

export function ChatConversation({ messagesByDate, currentUser, isThinking }: ChatConversationProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messagesByDate, isThinking]);

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return "Aujourd'hui";
    } else if (isYesterday(date)) {
      return "Hier";
    }
    return format(date, 'd MMMM yyyy', { locale: fr });
  };

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-8"
      style={{ scrollBehavior: "smooth" }}
    >
      <AnimatePresence mode="popLayout">
        {Object.entries(messagesByDate).map(([dateStr, messages]) => (
          <motion.div
            key={dateStr}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="sticky top-0 z-10 flex justify-center">
              <span className="text-xs font-medium text-muted-foreground bg-background/95 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                {formatDateHeader(dateStr)}
              </span>
            </div>
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChatBubble
                    content={message.content}
                    sender={message.sender}
                    timestamp={new Date(message.created_at)}
                    isCurrentUser={message.sender.id === currentUser?.id}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ChatBubble
              content="En train d'écrire..."
              sender={{
                id: 'assistant',
                full_name: 'Mr Victaure',
                avatar_url: '/bot-avatar.png'
              }}
              timestamp={new Date()}
              isCurrentUser={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}