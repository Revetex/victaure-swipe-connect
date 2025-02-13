
import { CreatePost } from "./feed/posts/CreatePost";
import { PostList } from "./feed/posts/PostList";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import { useRef, useState, useCallback } from "react";

export function Feed() {
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

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
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto"
      onScroll={handleScroll}
    >
      <div className="max-w-2xl mx-auto px-4 py-4">
        <CreatePost onPostCreated={invalidatePosts} />
        <PostList 
          onPostDeleted={invalidatePosts}
          onPostUpdated={invalidatePosts}
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
              "rounded-full p-2.5 shadow-lg hover:shadow-xl transition-all duration-200",
              "hover:scale-105 active:scale-95",
              "min-h-[40px] min-w-[40px] z-50",
              "touch-manipulation",
              "bottom-6 right-6"
            )}
            aria-label="Retourner en haut"
          >
            <ChevronUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
