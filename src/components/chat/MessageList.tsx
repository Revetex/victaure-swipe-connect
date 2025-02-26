
import { Message } from "@/types/messages";
import { motion } from "framer-motion";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`flex ${message.is_assistant ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`max-w-[80%] rounded-xl p-3 ${
              message.is_assistant
                ? 'bg-[#1A1F2C]/50 text-[#F1F0FB]'
                : 'bg-gradient-to-r from-[#64B5D9] to-[#4A90E2] text-white'
            }`}
          >
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
