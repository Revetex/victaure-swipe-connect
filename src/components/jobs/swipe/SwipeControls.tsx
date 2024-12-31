import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { X, Heart } from "lucide-react";

interface SwipeControlsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function SwipeControls({ onSwipeLeft, onSwipeRight }: SwipeControlsProps) {
  return (
    <div className="flex justify-center gap-4">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="lg"
          className="h-14 w-14 rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
          onClick={onSwipeLeft}
        >
          <X className="h-6 w-6" />
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="lg"
          className="h-14 w-14 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={onSwipeRight}
        >
          <Heart className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
}