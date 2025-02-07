
import { CreatePost } from "./feed/CreatePost";
import { PostList } from "./feed/PostList";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { FeedSidebar } from "./feed/FeedSidebar";
import { Suspense, useRef, useState } from "react";
import { ChevronUp, Menu } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
      className="w-full flex bg-background/95 backdrop-blur-sm min-h-screen"
    >
      {/* Header with Menu Button */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b h-16 flex items-center px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0">
            <Suspense fallback={null}>
              <FeedSidebar />
            </Suspense>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="flex-1 pt-16">
        <ScrollArea 
          ref={scrollRef} 
          className={cn(
            "h-[calc(100vh-4rem)]",
            isMobile && "touch-pan-y overscroll-y-contain"
          )}
          onScroll={handleScroll}
        >
          <div className={cn(
            "w-full mx-auto px-3 sm:px-4",
            "max-w-2xl"
          )}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-3"
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
              <ChevronUp className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
