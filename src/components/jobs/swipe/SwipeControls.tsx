import { Button } from "@/components/ui/button";
import { X, Heart } from "lucide-react";
import { motion } from "framer-motion";

interface SwipeControlsProps {
  onSwipe: (direction: "left" | "right") => void;
  isAnimating: boolean;
  className?: string;
}

export function SwipeControls({ onSwipe, isAnimating, className = "" }: SwipeControlsProps) {
  return (
    <motion.div 
      className={`flex justify-center gap-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Button
        size="lg"
        variant="outline"
        className="rounded-full w-16 h-16 p-0 border-2 hover:border-red-500 hover:text-red-500 transition-colors"
        onClick={() => onSwipe("left")}
        disabled={isAnimating}
      >
        <X className="h-8 w-8" />
      </Button>
      
      <Button
        size="lg"
        className="rounded-full w-16 h-16 p-0 bg-green-500 hover:bg-green-600 border-0"
        onClick={() => onSwipe("right")}
        disabled={isAnimating}
      >
        <Heart className="h-8 w-8" />
      </Button>
    </motion.div>
  );
}