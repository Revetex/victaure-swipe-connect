import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-12 right-0 z-50 bg-background/80 backdrop-blur-md rounded-lg p-2 w-24"
    >
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </motion.div>
  );
}