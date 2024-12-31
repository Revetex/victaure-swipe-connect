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
  const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);
  const background = useTransform(
    x,
    [-200, 0, 200],
    ["rgba(239, 68, 68, 0.2)", "rgba(0, 0, 0, 0)", "rgba(34, 197, 94, 0.2)"]
  );

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
    } else {
      await animate(x, 0, {
        type: "spring",
        stiffness: 400,
        damping: 30
      });
    }
  };

  const handleSwipeWithMatch = async (direction: "left" | "right") => {
    setIsAnimating(true);
    
    const targetX = direction === "left" ? -200 : 200;
    await animate(x, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      velocity: direction === "left" ? -800 : 800
    });

    if (direction === "right" && jobs[currentIndex]) {
      await onMatchSuccess(jobs[currentIndex].id);
    }
    await handleSwipe(direction);
    
    x.set(0);
    setSwipeDirection(null);
    setIsAnimating(false);
  };

  const handleButtonSwipe = async (direction: "left" | "right") => {
    if (isAnimating) return;
    await handleSwipeWithMatch(direction);
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </motion.div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return <SwipeEmptyState onRefresh={fetchJobs} />;
  }

  if (currentIndex >= jobs.length) {
    return (
      <SwipeEmptyState 
        onRefresh={() => {
          setCurrentIndex(0);
          fetchJobs();
        }} 
      />
    );
  }

  return (
    <motion.div 
      className="relative w-full max-w-md mx-auto px-4 sm:px-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        style={{ background }}
        className="absolute inset-0 rounded-3xl transition-colors"
      />
      <motion.div
        key={currentIndex}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ 
          x: swipeDirection === "left" ? -200 : swipeDirection === "right" ? 200 : 0,
          opacity: 0,
          transition: { duration: 0.2 }
        }}
        transition={{ 
          duration: 0.3,
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
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
    </motion.div>
  );
}