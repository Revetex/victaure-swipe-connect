import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JobFilters } from "./jobs/JobFilterUtils";
import { Button } from "./ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface SwipeMatchProps {
  filters: JobFilters;
  onMatchSuccess: (jobId: string) => void;
}

export function SwipeMatch({ filters, onMatchSuccess }: SwipeMatchProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="flex justify-center gap-4 mt-4">
        <Button variant="outline" size="lg">
          <ThumbsDown className="mr-2 h-4 w-4" />
          Passer
        </Button>
        <Button size="lg">
          <ThumbsUp className="mr-2 h-4 w-4" />
          Intéressé
        </Button>
      </div>
    </div>
  );
}