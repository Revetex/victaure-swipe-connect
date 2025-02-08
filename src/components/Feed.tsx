
import { CreatePost } from "./feed/posts/CreatePost";
import { PostList } from "./feed/posts/PostList";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Suspense, useRef, useState } from "react";

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
    <div className="min-h-[calc(100vh-8rem)] bg-background/95 backdrop-blur relative pt-16 pb-16">
      <ScrollArea 
        ref={scrollRef} 
        className="h-[calc(100vh-8rem)] w-full max-w-3xl mx-auto px-4"
        onScroll={handleScroll}
      >
        <div className="py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-3"
          >
            <CreatePost onPostCreated={handlePostCreated} />
          </motion.div>
          
          <Suspense 
            fallback={
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            }
          >
            <PostList 
              onPostDeleted={handlePostDeleted}
              onPostUpdated={handlePostUpdated}
            />
          </Suspense>
        </div>
      </ScrollArea>

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
              isMobile ? "bottom-24 right-4" : "bottom-20 right-4"
            )}
            aria-label="Retourner en haut"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
