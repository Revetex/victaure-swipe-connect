
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { CreatePost } from "./posts/CreatePost";
import { PostList } from "./posts/PostList";

export function Feed() {
  const queryClient = useQueryClient();

  const invalidatePosts = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }, [queryClient]);

  return (
    <div className="min-h-screen w-full">
      <div className={cn(
        "max-w-2xl mx-auto", // Centrage horizontal
        "px-4 sm:px-6",      // Padding horizontal responsive
        "pt-6"               // Padding top pour commencer en haut
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
          className="mt-6 pb-20"
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
