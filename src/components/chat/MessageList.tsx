
import { useEffect, useRef } from "react";
import { MessageListProps } from "@/types/messages";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MessageList({ 
  messages, 
  isLoading 
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="h-[calc(85vh-120px)] overflow-y-auto py-4 px-3 scrollbar-none">
      <div className="flex flex-col-reverse gap-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={cn(
              "flex gap-3",
              message.isUser ? "flex-row-reverse" : ""
            )}
          >
            <div className="flex-shrink-0">
              {message.isUser ? (
                <div className="w-8 h-8 rounded-full bg-[#64B5D9]/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-[#64B5D9]" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#1B2A4A] flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <div
              className={cn(
                "flex flex-col space-y-1 max-w-[80%]",
                message.isUser ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "rounded-lg px-4 py-2",
                  message.isUser
                    ? "bg-[#64B5D9] text-white"
                    : "bg-[#1B2A4A] text-white"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#1B2A4A] flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex space-x-2 items-center bg-[#1B2A4A] rounded-lg px-4 py-2">
              <div className="w-2 h-2 bg-[#64B5D9] rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-[#64B5D9] rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-[#64B5D9] rounded-full animate-bounce" />
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
