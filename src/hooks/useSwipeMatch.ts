import { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { JobFilters } from "@/components/jobs/JobFilterUtils";
import { useSwipeJobs } from "@/components/jobs/swipe/useSwipeJobs";

export function useSwipeMatch(filters: JobFilters, onMatchSuccess: (jobId: string) => Promise<void>) {
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

  return {
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
  };
}