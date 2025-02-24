
import { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Job } from "@/types/job";
import { JobCard } from "@/components/jobs/JobCard";

interface Message {
  content: string;
  isUser: boolean;
  username?: string;
  jobResults?: Job[];
}

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, isLoading }, ref) => {
    return (
      <div 
        ref={ref}
        className="h-full pt-16 pb-2 px-3 scrollbar-none flex flex-col-reverse"
      >
        <div className="space-y-3">
          {isLoading && (
            <div className="flex items-start">
              <div className="relative flex-1 bg-[#2A2D3E] rounded-2xl rounded-bl-sm px-4 py-3">
                <Loader2 className="w-4 h-4 text-white/80 animate-spin"/>
              </div>
            </div>
          )}
          
          {messages.map((message, index) => (
            <motion.div 
              key={index} 
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              layout="position"
            >
              <div 
                className={`flex-1 relative rounded-2xl px-3.5 py-2 ${
                  message.isUser 
                    ? 'bg-[#64B5D9] text-white rounded-br-sm ml-12' 
                    : 'bg-[#2A2D3E] text-[#F1F0FB] rounded-bl-sm mr-12'
                }`}
              >
                {!message.isUser ? (
                  <div className="space-y-4">
                    {message.jobResults && message.jobResults.length > 0 ? (
                      <div className="space-y-2">
                        {message.jobResults.map((job) => (
                          <JobCard
                            key={job.id}
                            job={job}
                            onClick={() => window.open(job.url, '_blank')}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{message.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }
);

MessageList.displayName = "MessageList";
