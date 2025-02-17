
import { motion } from "framer-motion";
import { JobFilters } from "./jobs/JobFilterUtils";
import { AnimatedJobCard } from "./jobs/AnimatedJobCard";
import { SwipeEmptyState } from "./jobs/swipe/SwipeEmptyState";
import { SwipeControls } from "./jobs/swipe/SwipeControls";
import { useSwipeMatch } from "@/hooks/useSwipeMatch";

interface SwipeMatchProps {
  filters: JobFilters;
  onMatchSuccess: (jobId: string) => Promise<void>;
}

export function SwipeMatch({ filters, onMatchSuccess }: SwipeMatchProps) {
  const {
    jobs,
    currentIndex,
    loading,
    swipeDirection,
    isDragging,
    isAnimating,
    x,
    rotate,
    opacity,
    scale,
    background,
    handleDragStart,
    handleDragEnd,
    handleButtonSwipe,
    fetchJobs,
    setCurrentIndex
  } = useSwipeMatch();

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
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
      className="relative w-full max-w-md mx-auto will-change-transform"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        style={{ background }}
        className="absolute inset-0 rounded-3xl transition-colors will-change-[background-color]"
      />
      <motion.div
        key={currentIndex}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ 
          x: swipeDirection === "left" ? -200 : swipeDirection === "right" ? 200 : 0,
          opacity: 0,
          transition: { duration: 0.15 }
        }}
        transition={{ 
          duration: 0.2,
          type: "spring",
          stiffness: 400,
          damping: 30
        }}
        className="will-change-transform"
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
