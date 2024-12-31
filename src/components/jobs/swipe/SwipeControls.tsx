import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

interface SwipeControlsProps {
  onSwipe: (direction: "left" | "right") => void;
  isAnimating?: boolean;
}

export function SwipeControls({ onSwipe, isAnimating }: SwipeControlsProps) {
  return (
    <motion.div 
      className="flex justify-center gap-4 mt-6 px-4 sm:px-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="outline"
        size="lg"
        className="w-16 h-16 rounded-full border-destructive text-destructive hover:bg-destructive/10 transition-all duration-200 shadow-sm disabled:opacity-50"
        onClick={() => onSwipe("left")}
        disabled={isAnimating}
      >
        <ThumbsDown className="h-6 w-6" />
      </Button>
      <Button
        size="lg"
        className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white transition-all duration-200 shadow-sm disabled:opacity-50"
        onClick={() => onSwipe("right")}
        disabled={isAnimating}
      >
        <ThumbsUp className="h-6 w-6" />
      </Button>
    </motion.div>
  );
}