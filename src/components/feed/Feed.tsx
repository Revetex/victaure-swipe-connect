
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

export function Feed() {
  const queryClient = useQueryClient();

  const invalidatePosts = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }, [queryClient]);

  return (
    <div className="w-full">
      <CreatePost onPostCreated={invalidatePosts} />
      <div className="mt-6 pb-20">
        <PostList 
          onPostDeleted={invalidatePosts}
          onPostUpdated={invalidatePosts}
        />
      </div>
    </div>
  );
}
