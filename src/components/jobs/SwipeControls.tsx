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
        className="border-destructive text-destructive hover:bg-destructive/10 transition-all duration-200 shadow-sm"
        onClick={() => onSwipe("left")}
      >
        <ThumbsDown className="h-5 w-5" />
      </Button>
      <Button
        size="lg"
        className="bg-green-500 hover:bg-green-600 text-white transition-all duration-200 shadow-sm"
        onClick={() => onSwipe("right")}
      >
        <ThumbsUp className="h-5 w-5" />
      </Button>
    </div>
  );
}