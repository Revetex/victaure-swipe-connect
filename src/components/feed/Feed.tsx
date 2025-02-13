
import { CreatePost } from "./posts/CreatePost";
import { PostList } from "./posts/PostList";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await invalidatePosts();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className={cn(
          "max-w-2xl mx-auto",
          "px-4 sm:px-6",
          "pt-20 pb-8"
        )}>
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="sticky top-16 z-40 bg-background/80 dark:bg-background/80 backdrop-blur-lg pb-4"
            >
              <CreatePost onPostCreated={handleRefresh} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <PostList 
                onPostDeleted={handleRefresh}
                onPostUpdated={handleRefresh}
              />
            </motion.div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
