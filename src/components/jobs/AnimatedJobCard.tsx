import { motion, useAnimation, MotionValue } from "framer-motion";
import { JobCard } from "@/components/JobCard";
import { Job } from "@/types/job";

interface AnimatedJobCardProps {
  job: Job;
  x: MotionValue<number>;
  rotate: MotionValue<number>;
  opacity: MotionValue<number>;
  onDragEnd: (event: any, info: any) => void;
  dragConstraints: React.RefObject<Element>;
}

export function AnimatedJobCard({
  job,
  x,
  rotate,
  opacity,
  onDragEnd,
  dragConstraints
}: AnimatedJobCardProps) {
  return (
    <motion.div
      drag="x"
      dragConstraints={dragConstraints}
      onDragEnd={onDragEnd}
      style={{ x, rotate, opacity }}
      className="cursor-grab active:cursor-grabbing"
    >
      <JobCard {...job} />
    </motion.div>
  );
}