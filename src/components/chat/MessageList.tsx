
import { forwardRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface Message {
  content: string;
  isUser: boolean;
  username?: string;
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
        className="h-[400px] overflow-y-auto py-4 px-3 scrollbar-none flex flex-col-reverse"
      >
        <div className="flex flex-col-reverse">
          <AnimatePresence mode="popLayout">
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex mb-3 items-end justify-start"
              >
                <div className="w-6 h-6 rounded-full bg-[#64B5D9] flex items-center justify-center mr-2 mb-1">
                  <span className="text-xs text-white font-medium">MV</span>
                </div>
                <div className="relative bg-[#2A2D3E] rounded-2xl rounded-bl-sm px-4 py-3">
                  <Loader2 className="w-4 h-4 text-white/80 animate-spin"/>
                </div>
              </motion.div>
            )}

            {messages.map((message, index) => (
              <motion.div 
                key={index} 
                className={`flex mb-3 items-end ${message.isUser ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                layout
              >
                {!message.isUser && (
                  <div className="w-6 h-6 rounded-full bg-[#64B5D9] flex items-center justify-center mr-2 mb-1">
                    <span className="text-xs text-white font-medium">MV</span>
                  </div>
                )}
                
                <motion.div 
                  className={`relative max-w-[85%] rounded-2xl px-3.5 py-2 ${
                    message.isUser 
                      ? 'bg-[#64B5D9] text-white rounded-br-sm' 
                      : 'bg-[#2A2D3E] text-[#F1F0FB] rounded-bl-sm'
                  }`}
                >
                  {!message.isUser ? (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm leading-relaxed"
                    >
                      <TypewriterEffect text={message.content} />
                    </motion.p>
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
                  <div className="w-6 h-6 rounded-full bg-[#2A2D3E] flex items-center justify-center ml-2 mb-1">
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

// Composant pour l'effet machine à écrire
function TypewriterEffect({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let index = 0;
    setDisplayText("");
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20); // Vitesse de frappe

    return () => clearInterval(interval);
  }, [text]);

  return <>{displayText}</>;
}

MessageList.displayName = "MessageList";
