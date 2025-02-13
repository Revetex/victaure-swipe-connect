
import { CreatePost } from "./posts/CreatePost";
import { PostList } from "./posts/PostList";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { useState, useCallback } from "react";

export function Feed() {
  const queryClient = useQueryClient();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isMobile = useIsMobile();

  const invalidatePosts = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }, [queryClient]);

  const handleScroll = useCallback((event: any) => {
    const target = event.target as HTMLDivElement;
    setShowScrollTop(target.scrollTop > 200);
  }, []);

  const scrollToTop = useCallback(() => {
    const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollArea) {
      scrollArea.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <ScrollArea 
      className="h-[calc(100vh-3.5rem)] w-full pb-20"
      onScroll={handleScroll}
    >
      <div className="max-w-2xl mx-auto px-4 space-y-6 min-h-[calc(100vh-3.5rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CreatePost onPostCreated={invalidatePosts} />
        </motion.div>

        <PostList 
          onPostDeleted={invalidatePosts}
          onPostUpdated={invalidatePosts}
        />
      </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={cn(
              "fixed z-20",
              isMobile ? "bottom-24 right-3" : "bottom-6 right-6"
            )}
          >
            <Button
              onClick={scrollToTop}
              size="icon"
              variant="default"
              className={cn(
                "bg-primary/90 hover:bg-primary text-primary-foreground",
                "rounded-full shadow-lg hover:shadow-xl transition-all duration-200",
                "hover:scale-105 active:scale-95",
                "h-10 w-10"
              )}
              aria-label="Retourner en haut"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </ScrollArea>
  );
}
