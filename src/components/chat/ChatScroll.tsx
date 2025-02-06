import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ChatScrollProps {
  children: React.ReactNode;
  className?: string;
  onScroll?: () => void;
}

export function ChatScroll({ children, className, onScroll }: ChatScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      scrollRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior
      });
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const isNearBottom = distanceFromBottom < 100;
    
    setShowScrollButton(!isNearBottom);
    setIsAutoScrolling(isNearBottom);
    
    onScroll?.();
  };

  useEffect(() => {
    if (isAutoScrolling) {
      scrollToBottom("instant");
    }
  }, [children, isAutoScrolling]);

  return (
    <div className="relative flex-1">
      <ScrollArea 
        ref={scrollRef} 
        className={cn("h-full pr-4", className)}
        onScroll={handleScroll}
      >
        <div className="flex flex-col gap-2">
          {children}
        </div>
      </ScrollArea>

      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 right-4"
          >
            <Button
              size="icon"
              variant="secondary"
              onClick={() => {
                scrollToBottom();
                setIsAutoScrolling(true);
              }}
              className="rounded-full shadow-lg"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}