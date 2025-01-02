import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface DashboardNavigationArrowsProps {
  onSwipe: (direction: number) => void;
}

export function DashboardNavigationArrows({ onSwipe }: DashboardNavigationArrowsProps) {
  return (
    <>
      <div className="fixed top-1/2 left-4 z-20">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm"
          onClick={() => onSwipe(-1)}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="fixed top-1/2 right-4 z-20">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm"
          onClick={() => onSwipe(1)}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </>
  );
}