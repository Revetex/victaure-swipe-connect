import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { AIMessageCard } from "./AIMessageCard";

interface AIMessageListProps {
  messages: any[];
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function AIMessageList({ messages, onScroll, messagesEndRef }: AIMessageListProps) {
  return (
    <ScrollArea 
      className="h-[400px] p-4"
      onScroll={onScroll}
    >
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AIMessageCard message={message} />
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}