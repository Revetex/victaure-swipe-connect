
import { CreatePost } from "./posts/CreatePost";
import { PostList } from "./posts/PostList";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useState, useCallback } from "react";

export function Feed() {
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isMobile = useIsMobile();

  const invalidatePosts = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }, [queryClient]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    setShowScrollTop(scrollRef.current.scrollTop > 200);
  }, []);

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <ScrollArea 
      ref={scrollRef} 
      className="h-[calc(100vh-3.5rem)] w-full scrollbar-none"
      onScroll={handleScroll}
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <CreatePost onPostCreated={invalidatePosts} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <PostList 
            onPostDeleted={invalidatePosts}
            onPostUpdated={invalidatePosts}
          />
        </motion.div>
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
              "rounded-full p-2.5 shadow-lg hover:shadow-xl transition-all duration-200",
              "hover:scale-105 active:scale-95",
              "min-h-[40px] min-w-[40px] z-20",
              "touch-manipulation",
              isMobile ? "bottom-20 right-3" : "bottom-6 right-6"
            )}
            aria-label="Retourner en haut"
          >
            <ChevronUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </ScrollArea>
  );
}
