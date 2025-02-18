
import { useState } from "react";
import { CreatePost } from "./posts/CreatePost";
import { PostList } from "./posts/PostList";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useCallback } from "react";

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
    <div className="min-h-screen w-full overflow-y-auto">
      <div className={cn(
        "max-w-3xl mx-auto space-y-4",
        "px-3 sm:px-4 py-3",
        "pb-safe"
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
          className="pb-20"
        >
          <PostList 
            onPostDeleted={invalidatePosts}
            onPostUpdated={invalidatePosts}
          />
        </motion.div>
      </div>
    </div>
  );
}
