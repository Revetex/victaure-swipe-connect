
import { Message } from "@/types/messages";
import { motion } from "framer-motion";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`flex ${message.sender_id === 'assistant' ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`max-w-[80%] rounded-xl p-3 ${
              message.sender_id === 'assistant'
                ? 'bg-[#1A1F2C]/50 text-[#F1F0FB]'
                : 'bg-gradient-to-r from-[#64B5D9] to-[#4A90E2] text-white'
            }`}
          >
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
        </motion.div>
      ))}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-start"
        >
          <div className="max-w-[80%] rounded-xl p-3 bg-[#1A1F2C]/50">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-[#64B5D9] rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-[#64B5D9] rounded-full animate-bounce delay-200" />
              <div className="w-2 h-2 bg-[#64B5D9] rounded-full animate-bounce delay-400" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
