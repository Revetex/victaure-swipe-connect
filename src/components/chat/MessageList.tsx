
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Job } from "@/types/job";
import { JobCard } from "@/components/jobs/JobCard";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Message {
  content: string;
  isUser: boolean;
  jobResults?: Job[];
  timestamp: number;
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
        className="h-full pt-4 pb-2 px-3 overflow-y-auto flex flex-col-reverse"
      >
        <div className="space-y-3">
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
                <div className="mb-1 flex justify-between items-center text-xs opacity-80">
                  <span>{message.isUser ? 'Vous' : 'Mr Victaure'}</span>
                  <span>
                    {format(new Date(message.timestamp), "d MMM à HH:mm", { locale: fr })}
                  </span>
                </div>
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
          
          {isLoading && (
            <motion.div 
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex-1 relative bg-[#2A2D3E] rounded-2xl rounded-bl-sm px-4 py-3 mr-12">
                <div className="mb-1 flex justify-between items-center text-xs opacity-80">
                  <span>Mr Victaure</span>
                  <span>{format(new Date(), "d MMM à HH:mm", { locale: fr })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }
);

MessageList.displayName = "MessageList";
