
import { CreatePost } from "./feed/CreatePost";
import { PostList } from "./feed/PostList";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { FeedSidebar } from "./feed/FeedSidebar";
import { Suspense, useRef, useState } from "react";
import { ChevronUp, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Feed() {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex bg-background/95 backdrop-blur-sm min-h-screen relative"
    >
      {!isMobile && (
        <Suspense fallback={null}>
          <FeedSidebar />
        </Suspense>
      )}
      
      <div className="flex-1 relative">
        <ScrollArea 
          ref={scrollRef} 
          className="h-[calc(100vh-4rem)]"
          onScroll={handleScroll}
        >
          <div className="max-w-2xl w-full mx-auto px-3 sm:px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={cn(
                "sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-3",
                isMobile && "border-b"
              )}
            >
              <CreatePost onPostCreated={handlePostCreated} />
            </motion.div>
            
            <div className="py-3">
              <Suspense 
                fallback={
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                }
              >
                <PostList 
                  onPostDeleted={handlePostDeleted}
                  onPostUpdated={handlePostUpdated}
                />
              </Suspense>
            </div>
          </div>
        </ScrollArea>

        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={scrollToTop}
              className="fixed bottom-20 right-4 bg-primary/90 hover:bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <ChevronUp className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
