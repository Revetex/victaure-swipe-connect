
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
        "min-h-screen w-full",
        "bg-gradient-to-br from-white/50 via-white/30 to-white/20",
        "dark:from-[#1B2A4A]/50 dark:via-[#1B2A4A]/30 dark:to-[#1B2A4A]/20",
        "backdrop-blur-sm",
        isMobile ? "pb-20 pt-16" : "py-6"
      )}
    >
      <div className="container mx-auto max-w-5xl px-4">
        <FriendsContent />
      </div>
    </motion.div>
  );
}
