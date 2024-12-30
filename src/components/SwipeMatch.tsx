import { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { JobFilters } from "./jobs/JobFilterUtils";
import { AnimatedJobCard } from "./jobs/AnimatedJobCard";
import { SwipeEmptyState } from "./jobs/swipe/SwipeEmptyState";
import { SwipeControls } from "./jobs/swipe/SwipeControls";
import { useSwipeJobs } from "./jobs/swipe/useSwipeJobs";

interface SwipeMatchProps {
  filters: JobFilters;
  onMatchSuccess: (jobId: string) => Promise<void>;
}

export function SwipeMatch({ filters, onMatchSuccess }: SwipeMatchProps) {
  const {
    jobs,
    currentIndex,
    handleSwipe,
    fetchJobs,
    setCurrentIndex,
    loading
  } = useSwipeJobs(filters);

  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = async (event: any, info: any) => {
    setIsDragging(false);
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 800) {
      setSwipeDirection("right");
      await handleSwipeWithMatch("right");
    } else if (offset < -100 || velocity < -800) {
      setSwipeDirection("left");
      await handleSwipeWithMatch("left");
    }
    x.set(0);
  };

  const handleSwipeWithMatch = async (direction: "left" | "right") => {
    if (direction === "right" && jobs[currentIndex]) {
      await onMatchSuccess(jobs[currentIndex].id);
    }
    await handleSwipe(direction);
  };

  const handleButtonSwipe = async (direction: "left" | "right") => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSwipeDirection(direction);
    
    const targetX = direction === "left" ? -200 : 200;
    
    await animate(x, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30
    });
    
    await handleSwipeWithMatch(direction);
    
    x.set(0);
    setSwipeDirection(null);
    setIsAnimating(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  if (!jobs || jobs.length === 0) {
    return <SwipeEmptyState onRefresh={fetchJobs} />;
  }

  if (currentIndex >= jobs.length) {
    return <SwipeEmptyState onRefresh={() => {
      setCurrentIndex(0);
      fetchJobs();
    }} />;
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <motion.div
        key={currentIndex}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ 
          x: swipeDirection === "left" ? -200 : swipeDirection === "right" ? 200 : 0,
          opacity: 0,
          transition: { duration: 0.2 }
        }}
        transition={{ duration: 0.3 }}
      >
        <AnimatedJobCard
          job={jobs[currentIndex]}
          x={x}
          rotate={rotate}
          opacity={opacity}
          scale={scale}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          isDragging={isDragging}
        />
      </motion.div>
      
      <SwipeControls onSwipe={handleButtonSwipe} isAnimating={isAnimating} />
    </div>
  );
}