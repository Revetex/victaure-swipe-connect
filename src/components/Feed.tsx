
import { useState } from "react";
import { CreatePost } from "./posts/CreatePost";
import { PostList } from "./posts/PostList";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function Feed() {
  const queryClient = useQueryClient();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isMobile = useIsMobile();

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto">
      <div className={cn(
        "max-w-3xl mx-auto space-y-4",
        "px-4 sm:px-6 py-6",
        "pb-safe"
      )}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl mx-auto"
        >
          <CreatePost onPostCreated={invalidatePosts} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="pb-20 w-full max-w-2xl mx-auto"
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
