import { CreatePost } from "./feed/posts/CreatePost";
import { PostList } from "./feed/posts/PostList";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { FeedSidebar } from "./feed/FeedSidebar";
import { Suspense, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Feed() {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full min-h-screen bg-background relative mt-16"
    >
      <div className="flex">
        {!isMobile && sidebarOpen && (
          <motion.div
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            className="w-[280px] lg:w-[350px] fixed left-0 top-16 h-[calc(100vh-4rem)] flex-shrink-0 bg-card/50 backdrop-blur-sm border-r overflow-y-auto"
          >
            <Suspense fallback={null}>
              <FeedSidebar />
            </Suspense>
          </motion.div>
        )}

        <main className={cn(
          "flex-1 transition-all duration-300",
          isMobile ? "px-4" : "px-8",
          sidebarOpen ? "ml-[280px] lg:ml-[350px]" : "ml-0"
        )}>
          <ScrollArea 
            ref={scrollRef} 
            className="h-[calc(100vh-4rem)]"
            onScroll={handleScroll}
          >
            <div className="max-w-2xl mx-auto py-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="sticky top-0 z-[55] bg-background/95 backdrop-blur-sm py-3"
              >
                <CreatePost onPostCreated={handlePostCreated} />
              </motion.div>
              
              <div className="py-3">
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
                  "fixed right-4 bg-primary/90 hover:bg-primary text-primary-foreground",
                  "rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  "min-h-[44px] min-w-[44px]",
                  isMobile ? "bottom-24" : "bottom-8"
                )}
                aria-label="Retourner en haut"
              >
                <ChevronUp className="h-5 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
}
