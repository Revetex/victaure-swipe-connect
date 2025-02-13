
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const invalidatePosts = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }, [queryClient]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    setShowScrollTop(scrollRef.current.scrollTop > 200);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await invalidatePosts();
    setTimeout(() => setIsRefreshing(false), 500);
  };

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
            className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm pb-4"
          >
            <CreatePost onPostCreated={invalidatePosts} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isRefreshing ? 0.5 : 1 }}
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
