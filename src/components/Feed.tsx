import { CreatePost } from "./feed/CreatePost";
import { PostList } from "./feed/PostList";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

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
      className="w-full h-[100dvh] flex flex-col bg-background"
    >
      <div className="flex-1 max-w-3xl w-full mx-auto px-3 sm:px-6 lg:px-8 overflow-hidden">
        <div className="h-full flex flex-col space-y-3 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              isMobile ? 'sticky top-0 z-10 bg-background/95 backdrop-blur-sm pt-2 pb-3 -mx-3 px-3 border-b' : 'pt-4 sm:pt-6'
            )}
          >
            <CreatePost onPostCreated={handlePostCreated} />
          </motion.div>
          <div className="flex-1 min-h-0">
            <PostList onPostDeleted={handlePostDeleted} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}