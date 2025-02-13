
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
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className={cn(
        "max-w-2xl mx-auto",
        "px-4 sm:px-6 py-4",
        "space-y-6"
      )}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "sticky top-0 z-40",
            "bg-background/95 dark:bg-background/95",
            "backdrop-blur-md",
            "pb-4 pt-2",
            "border-b border-border/50"
          )}
        >
          <CreatePost onPostCreated={handleRefresh} />
        </motion.div>

        <PostList 
          onPostDeleted={handleRefresh}
          onPostUpdated={handleRefresh}
        />
      </div>
    </ScrollArea>
  );
}
