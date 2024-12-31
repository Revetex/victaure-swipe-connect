import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { X, Heart } from "lucide-react";

export interface SwipeControlsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isAnimating?: boolean;
  onSwipe?: (direction: "left" | "right") => Promise<void>;
}

export function SwipeControls({ onSwipeLeft, onSwipeRight, onSwipe, isAnimating }: SwipeControlsProps) {
  const handleSwipe = async (direction: "left" | "right") => {
    if (onSwipe) {
      await onSwipe(direction);
    } else {
      direction === "left" ? onSwipeLeft() : onSwipeRight();
    }
  };

  return (
    <div className="flex justify-center gap-4">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="lg"
          className="h-14 w-14 rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
          onClick={() => handleSwipe("left")}
          disabled={isAnimating}
        >
          <X className="h-6 w-6" />
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="lg"
          className="h-14 w-14 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={() => handleSwipe("right")}
          disabled={isAnimating}
        >
          <Heart className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
}