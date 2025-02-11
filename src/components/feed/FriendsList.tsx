
import { Card } from "@/components/ui/card";
import { FriendsContent } from "./friends/FriendsContent";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

export function FriendsList() {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "container mx-auto max-w-4xl",
      "px-4 sm:px-6",
      isMobile ? "py-4" : "py-6",
      "min-h-[calc(100vh-4rem)]",
      "mt-16" // Add margin-top to account for the header height
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="backdrop-blur-sm bg-card/80 shadow-lg">
          <FriendsContent />
        </Card>
      </motion.div>
    </div>
  );
}
