
import { CreatePost } from "./posts/CreatePost";
import { PostList } from "./posts/PostList";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useState } from "react";

export function Feed() {
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isMobile = useIsMobile();

  const handlePostCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  const handlePostDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  const handlePostUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    setShowScrollTop(scrollRef.current.scrollTop > 200);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <ScrollArea 
      ref={scrollRef} 
      className={cn(
        "w-full",
        isMobile ? "h-[calc(100dvh-8rem)]" : "h-[calc(100vh-8rem)]"
      )}
      onScroll={handleScroll}
    >
      <div className="max-w-3xl mx-auto px-4 py-4 pb-24 space-y-4">
        <CreatePost onPostCreated={handlePostCreated} />
        <PostList 
          onPostDeleted={handlePostDeleted}
          onPostUpdated={handlePostUpdated}
        />
      </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToTop}
            className={cn(
              "fixed bg-primary/90 hover:bg-primary text-primary-foreground",
              "rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200",
              "hover:scale-105 active:scale-95",
              "min-h-[44px] min-w-[44px] z-20",
              isMobile ? "bottom-24 right-4" : "bottom-8 right-4"
            )}
            aria-label="Retourner en haut"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </ScrollArea>
  );
}
