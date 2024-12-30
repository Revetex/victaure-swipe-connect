import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface SwipeControlsProps {
  onSwipe: (direction: "left" | "right") => void;
}

export function SwipeControls({ onSwipe }: SwipeControlsProps) {
  return (
    <div className="flex justify-center gap-4 mt-6">
      <Button
        variant="outline"
        size="lg"
        className="border-destructive text-destructive hover:bg-destructive/10 transition-all duration-200 shadow-sm dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500/10"
        onClick={() => onSwipe("left")}
      >
        <ThumbsDown className="h-5 w-5" />
      </Button>
      <Button
        size="lg"
        className="bg-green-500 hover:bg-green-600 text-white transition-all duration-200 shadow-sm dark:bg-green-600 dark:hover:bg-green-700"
        onClick={() => onSwipe("right")}
      >
        <ThumbsUp className="h-5 w-5" />
      </Button>
    </div>
  );
}