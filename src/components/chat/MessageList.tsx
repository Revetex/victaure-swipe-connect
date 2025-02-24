
import { forwardRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/job";
import { JobCard } from "@/components/jobs/JobCard";
import { useJobsData } from "@/hooks/useJobsData";
import { useGeolocation } from "@/hooks/useGeolocation";

interface Message {
  content: string;
  isUser: boolean;
  username?: string;
  searchResults?: {
    title: string;
    url: string;
    snippet: string;
  }[];
  jobResults?: Job[];
}

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

const TypewriterEffect = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState(text.charAt(0));
  
  useEffect(() => {
    let index = 1;
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return <>{displayText}</>;
};

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, isLoading }, ref) => {
    const { location } = useGeolocation();
    const { data: allJobs } = useJobsData();

    const getNearbyJobs = (radius: number = 50) => {
      if (!location || !allJobs) return [];
      
      return allJobs.filter(job => {
        if (!job.latitude || !job.longitude) return false;
        
        // Calcul de la distance en km
        const R = 6371; // Rayon de la Terre en km
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

    return (
      <div 
        ref={ref}
        className="h-full overflow-y-auto py-4 px-3 scrollbar-none flex flex-col-reverse"
      >
        <div className="flex flex-col-reverse space-y-reverse space-y-3">
          <AnimatePresence mode="popLayout">
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex mb-3 items-start"
              >
                <div className="w-6 h-6 rounded-full bg-[#64B5D9] flex items-center justify-center mr-2 mt-1">
                  <span className="text-xs text-white font-medium">MV</span>
                </div>
                <div className="relative flex-1 bg-[#2A2D3E] rounded-2xl rounded-bl-sm px-4 py-3">
                  <Loader2 className="w-4 h-4 text-white/80 animate-spin"/>
                </div>
              </motion.div>
            )}
            
            {messages.map((message, index) => (
              <motion.div 
                key={index} 
                className={`flex mb-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                layout
              >
                {!message.isUser && (
                  <div className="w-6 h-6 rounded-full bg-[#64B5D9] flex items-center justify-center mr-2 mt-1">
                    <span className="text-xs text-white font-medium">MV</span>
                  </div>
                )}
                
                <motion.div 
                  className={`flex-1 relative rounded-2xl px-3.5 py-2 ${
                    message.isUser 
                      ? 'bg-[#64B5D9] text-white rounded-br-sm ml-12' 
                      : 'bg-[#2A2D3E] text-[#F1F0FB] rounded-bl-sm mr-12'
                  }`}
                >
                  {!message.isUser ? (
                    <div className="space-y-2">
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm leading-relaxed"
                      >
                        <TypewriterEffect text={message.content} />
                      </motion.p>

                      {/* Affichage des offres d'emploi à proximité */}
                      {message.content.toLowerCase().includes('emploi') && (
                        <div className="mt-4 space-y-4">
                          <h4 className="text-sm font-medium text-[#64B5D9]">
                            Offres d'emploi près de vous:
                          </h4>
                          <div className="space-y-2">
                            {getNearbyJobs().map((job) => (
                              <JobCard
                                key={job.id}
                                job={job}
                                onClick={() => window.open(job.url, '_blank')}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Affichage des résultats de recherche web */}
                      {message.searchResults?.length > 0 && (
                        <div className="mt-2 space-y-2 border-t border-[#64B5D9]/20 pt-2">
                          <div className="flex items-center gap-2 text-xs text-[#64B5D9]">
                            <Globe className="h-3 w-3" />
                            <span>Sources web</span>
                          </div>
                          {message.searchResults.map((result, idx) => (
                            <a
                              key={idx}
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block rounded-lg bg-[#1A1F2C] p-2 hover:bg-[#2A2D3E] transition-colors"
                            >
                              <h4 className="text-sm font-medium text-[#64B5D9] mb-1">{result.title}</h4>
                              <p className="text-xs text-[#F1F0FB]/70">{result.snippet}</p>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  )}
                  <span className={`absolute -bottom-4 text-[10px] ${
                    message.isUser ? 'right-0 text-[#64B5D9]' : 'left-0 text-[#F1F0FB]/60'
                  }`}>
                    {message.isUser ? 'Vous' : 'Mr. Victaure'}
                  </span>
                </motion.div>

                {message.isUser && (
                  <div className="w-6 h-6 rounded-full bg-[#2A2D3E] flex items-center justify-center ml-2 mt-1">
                    <span className="text-xs text-white font-medium">V</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

MessageList.displayName = "MessageList";
