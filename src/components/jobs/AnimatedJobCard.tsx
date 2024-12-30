import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Job } from "@/types/job";
import { MotionValue } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Clock, Award, Building2 } from "lucide-react";

interface AnimatedJobCardProps {
  job: Job;
  x: MotionValue<number>;
  rotate: MotionValue<number>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  onDragStart: () => void;
  onDragEnd: (event: any, info: any) => void;
  dragConstraints: React.RefObject<Element>;
  isDragging: boolean;
}

export function AnimatedJobCard({
  job,
  x,
  rotate,
  opacity,
  scale,
  onDragStart,
  onDragEnd,
  dragConstraints,
  isDragging
}: AnimatedJobCardProps) {
  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
        scale,
      }}
      drag="x"
      dragConstraints={dragConstraints}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'z-50' : ''}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="p-6 glass-card relative overflow-hidden border-2 border-primary/20 dark:border-primary/10 transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#9b87f5] via-[#7E69AB] to-[#6E59A5]" />
        
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <Building2 className="h-4 w-4 text-[#9b87f5]" />
              <span>{job.company}</span>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-[#9b87f5]" />
              <span>{job.location}</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4 text-[#9b87f5]" />
              <span>{job.contract_type}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 text-[#9b87f5]" />
              <span>{job.contract_type}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="h-4 w-4 text-[#9b87f5]" />
              <span>{job.experience_level}</span>
            </div>
          </div>

          {job.salary && (
            <div>
              <p className="font-semibold text-[#9b87f5] dark:text-[#b4a4f7]">{job.salary}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {job.skills?.map((skill, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="bg-[#F1F0FB] dark:bg-[#2A2438] text-[#7E69AB] dark:text-[#b4a4f7] hover:bg-[#E5DEFF] dark:hover:bg-[#352B47] transition-colors"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Swipe indicators */}
        <motion.div
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ opacity: x.get() < 0 ? Math.abs(x.get()) / 100 : 0 }}
        >
          <div className="bg-red-500/80 dark:bg-red-500/90 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
            Passer
          </div>
        </motion.div>

        <motion.div
          className="absolute right-4 top-1/2 -translate-y-1/2"
          style={{ opacity: x.get() > 0 ? x.get() / 100 : 0 }}
        >
          <div className="bg-green-500/80 dark:bg-green-500/90 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
            Like
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
}