
import { FriendsContent } from "./friends/FriendsContent";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

export function FriendsList() {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "min-h-screen w-full bg-background pt-16",
        isMobile ? "pb-20" : "pb-6"
      )}
    >
      <FriendsContent />
    </motion.div>
  );
}
