
import { forwardRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Job } from "@/types/job";
import { JobCard } from "@/components/jobs/JobCard";
import { useJobsData } from "@/hooks/useJobsData";
import { useGeolocation } from "@/hooks/useGeolocation";

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
    const { location, loading: locationLoading } = useGeolocation();
    const { data: allJobs } = useJobsData();
    const [typingIndex, setTypingIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const typeMessage = async (text: string, speed = 30) => {
      setIsTyping(true);
      let currentIndex = 0;
      setCurrentText("");

      return new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          if (currentIndex < text.length) {
            setCurrentText((prev) => prev + text[currentIndex]);
            currentIndex++;
          } else {
            clearInterval(interval);
            setIsTyping(false);
            resolve();
          }
        }, speed);
      });
    };

    useEffect(() => {
      if (messages.length > typingIndex && !messages[typingIndex].isUser) {
        typeMessage(messages[typingIndex].content).then(() => {
          setTypingIndex(typingIndex + 1);
        });
      } else if (messages.length > typingIndex && messages[typingIndex].isUser) {
        setTypingIndex(typingIndex + 1);
      }
    }, [messages, typingIndex]);

    const getNearbyJobs = (radius: number = 50) => {
      if (!location || !allJobs) return [];
      
      return allJobs.filter(job => {
        if (!job.latitude || !job.longitude) return false;
        
        const R = 6371;
        const dLat = (job.latitude - location.latitude) * Math.PI / 180;
        const dLon = (job.longitude - location.longitude) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(location.latitude * Math.PI / 180) * Math.cos(job.latitude * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return distance <= radius;
      });
    };

    useEffect(() => {
      if (messages.length === 1 && !messages[0].isUser) {
        const nearbyJobs = getNearbyJobs();
        if (nearbyJobs.length > 0) {
          messages[0].jobResults = nearbyJobs;
        }
      }
    }, [messages, location]);

    return (
      <div 
        ref={ref}
        className="h-full overflow-y-auto py-4 px-3 scrollbar-none flex flex-col"
      >
        <div className="flex flex-col space-y-3 mt-auto">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div 
                key={index}
                className={`flex mb-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <motion.div 
                  className={`flex-1 relative rounded-2xl px-3.5 py-2 ${
                    message.isUser 
                      ? 'bg-[#64B5D9] text-white rounded-br-sm ml-12' 
                      : 'bg-[#2A2D3E] text-[#F1F0FB] rounded-bl-sm mr-12'
                  }`}
                >
                  {!message.isUser ? (
                    <div className="space-y-4">
                      {index === typingIndex - 1 && isTyping ? (
                        <p className="text-sm">{currentText}</p>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                      {message.jobResults && message.jobResults.length > 0 && (
                        <div className="space-y-2">
                          {message.jobResults.map((job) => (
                            <JobCard
                              key={job.id}
                              job={job}
                              onClick={() => window.open(job.url, '_blank')}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  )}
                </motion.div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex mb-3 items-start"
              >
                <div className="relative flex-1 bg-[#2A2D3E] rounded-2xl rounded-bl-sm px-4 py-3">
                  <Loader2 className="w-4 h-4 text-white/80 animate-spin"/>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

MessageList.displayName = "MessageList";
