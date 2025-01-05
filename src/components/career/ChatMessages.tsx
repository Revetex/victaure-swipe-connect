import { Message } from "@/types/chat/messageTypes";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
}

export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  return (
    <AnimatePresence>
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-4 rounded-lg ${
            message.sender === "user"
              ? "bg-blue-600/20 ml-auto"
              : "bg-gray-800/50"
          } max-w-[80%] mb-4`}
        >
          <p className="text-gray-200">{message.content}</p>
        </motion.div>
      ))}
      {isTyping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2 text-gray-400"
        >
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}