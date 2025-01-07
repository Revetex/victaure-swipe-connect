import { useSwipeJobs } from "./jobs/swipe/useSwipeJobs";
import { AnimatedJobCard } from "./jobs/AnimatedJobCard";
import { JobFilters } from "@/types/filters";
import { Loader2 } from "lucide-react";
import { useMotionValue } from "framer-motion";

interface SwipeMatchProps {
  filters: JobFilters;
  onMatchSuccess: (jobId: string) => Promise<void>;
}

export function SwipeMatch({ filters, onMatchSuccess }: SwipeMatchProps) {
  const { jobs, currentIndex, handleSwipe, loading } = useSwipeJobs(filters);
  
  // Initialize motion values
  const x = useMotionValue(0);
  const rotate = useMotionValue(0);
  const opacity = useMotionValue(1);
  const scale = useMotionValue(1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucune offre disponible</p>
      </div>
    );
  }

  const currentJob = jobs[currentIndex];

  if (!currentJob) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Plus d'offres disponibles</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto h-[600px]">
      <AnimatedJobCard
        job={currentJob}
        x={x}
        rotate={rotate}
        opacity={opacity}
        scale={scale}
        onDragStart={() => {}}
        onDragEnd={async (_, info) => {
          const offset = info.offset.x;
          const velocity = info.velocity.x;

          if (Math.abs(velocity) >= 500 || Math.abs(offset) >= 100) {
            const direction = offset > 0 ? "right" : "left";
            await handleSwipe(direction);
            if (direction === "right") {
              await onMatchSuccess(currentJob.id);
            }
          }
        }}
        isDragging={false}
      />
    </div>
  );
}