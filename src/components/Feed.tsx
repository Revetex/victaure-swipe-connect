
import { CreatePost } from "./feed/CreatePost";
import { PostList } from "./feed/PostList";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { FeedSidebar } from "./feed/FeedSidebar";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export function Feed() {
  const queryClient = useQueryClient();
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex bg-background min-h-screen"
    >
      {!isMobile && (
        <Suspense fallback={null}>
          <FeedSidebar />
        </Suspense>
      )}
      
      <div className="flex-1">
        <div className="max-w-3xl w-full mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-4",
              isMobile && "border-b"
            )}
          >
            <CreatePost onPostCreated={handlePostCreated} />
          </motion.div>
          
          <div className="py-4">
            <Suspense 
              fallback={
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
      </div>
    </motion.div>
  );
}

