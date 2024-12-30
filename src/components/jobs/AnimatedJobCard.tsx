import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Job } from "@/types/job";
import { MotionValue } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Clock, Award } from "lucide-react";

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
      <Card className="p-6 bg-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-victaure-blue to-green-400" />
        
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Briefcase className="h-4 w-4" />
              <span>{job.contract_type}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{job.contract_type}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Award className="h-4 w-4" />
              <span>{job.experience_level}</span>
            </div>
          </div>

          <div>
            <p className="font-semibold text-victaure-blue">{job.salary}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {job.skills?.map((skill, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
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
          <div className="bg-red-500/80 text-white px-4 py-2 rounded-lg">
            Passer
          </div>
        </motion.div>

        <motion.div
          className="absolute right-4 top-1/2 -translate-y-1/2"
          style={{ opacity: x.get() > 0 ? x.get() / 100 : 0 }}
        >
          <div className="bg-green-500/80 text-white px-4 py-2 rounded-lg">
            Like
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
}