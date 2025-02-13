
import { CreatePost } from "./posts/CreatePost";
import { PostList } from "./posts/PostList";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
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

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden pt-4">
      <ScrollArea 
        ref={scrollRef} 
        className="h-full w-full scrollbar-none"
        onScroll={handleScroll}
      >
        <div className={cn(
          "max-w-3xl mx-auto space-y-4",
          "px-3 sm:px-4"
        )}>
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
      </ScrollArea>
    </div>
  );
}
