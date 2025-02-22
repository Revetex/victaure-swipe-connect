
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
        "bg-gradient-to-br from-[#F2FCE2]/50 via-[#D3E4FD]/30 to-[#FFDEE2]/20",
        "backdrop-blur-sm",
        isMobile ? "pb-20" : "pb-6",
        "pt-16"
      )}
    >
      <FriendsContent />
    </motion.div>
  );
}
