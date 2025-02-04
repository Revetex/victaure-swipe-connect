import { CreatePost } from "./feed/CreatePost";
import { PostList } from "./feed/PostList";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function Feed() {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const handlePostCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  const handlePostDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full min-h-[100dvh] flex flex-col bg-background relative"
    >
      <div className="flex-1 max-w-3xl w-full mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "sticky top-0 z-50 bg-background/95 backdrop-blur-sm py-4",
              isMobile && "border-b"
            )}
          >
            <CreatePost onPostCreated={handlePostCreated} />
          </motion.div>
          
          <div className="flex-1 py-4">
            <PostList onPostDeleted={handlePostDeleted} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}