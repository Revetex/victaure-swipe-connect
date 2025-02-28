
import { FriendsContent } from "./friends/FriendsContent";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

export function FriendsList() {
  const isMobile = useIsMobile();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "min-h-screen w-full bg-gradient-to-br from-[#F2FCE2]/50 via-[#D3E4FD]/30 to-[#FFDEE2]/20",
        "backdrop-blur-sm px-4",
        isMobile ? "pb-20 pt-16" : "py-6"
      )}
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="container mx-auto max-w-3xl"
      >
        <FriendsContent />
      </motion.div>
    </motion.div>
  );
}
