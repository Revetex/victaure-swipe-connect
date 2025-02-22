
import { useState } from "react";
import { CreatePost } from "./posts/CreatePost";
import { PostList } from "./posts/PostList";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function Feed() {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] mt-16 max-w-3xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mb-4"
      >
        <CreatePost onPostCreated={invalidatePosts} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <PostList 
          onPostDeleted={invalidatePosts}
          onPostUpdated={invalidatePosts}
        />
      </motion.div>
    </section>
  );
}
