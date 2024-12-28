import { motion, MotionValue } from "framer-motion";
import { JobCard } from "@/components/JobCard";
import { Job } from "@/types/job";
import { JobActions } from "./JobActions";

interface AnimatedJobCardProps {
  job: Job;
  x: MotionValue<number>;
  rotate: MotionValue<number>;
  opacity: MotionValue<number>;
  onDragEnd: (event: any, info: any) => void;
  dragConstraints: React.RefObject<Element>;
  onDelete?: () => void;
  onEdit?: () => void;
}

export function AnimatedJobCard({
  job,
  x,
  rotate,
  opacity,
  onDragEnd,
  dragConstraints,
  onDelete,
  onEdit
}: AnimatedJobCardProps) {
  return (
    <motion.div
      drag="x"
      dragConstraints={dragConstraints}
      onDragEnd={onDragEnd}
      style={{ x, rotate, opacity }}
      className="cursor-grab active:cursor-grabbing"
    >
      <div className="relative">
        <JobCard {...job} />
        <JobActions 
          jobId={job.id} 
          employerId={job.employer_id}
          onDelete={onDelete || (() => {})}
          onEdit={onEdit || (() => {})}
        />
      </div>
    </motion.div>
  );
}