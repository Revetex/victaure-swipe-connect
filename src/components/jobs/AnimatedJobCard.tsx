import { motion, MotionValue } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Job } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Clock, Award, Building2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

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
  const skills = job.required_skills || job.skills || [];

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
      <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-victaure-blue to-green-400" />
        
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{job.title}</h3>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-1">
              <Building2 className="h-4 w-4" />
              <span>{job.company}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Briefcase className="h-4 w-4" />
              <span>{job.contract_type}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Clock className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(job.created_at || ''), { 
                addSuffix: true,
                locale: fr 
              })}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Award className="h-4 w-4" />
              <span>{job.experience_level}</span>
            </div>
          </div>

          <div>
            <p className="font-semibold text-victaure-blue dark:text-blue-400">{job.salary}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 4).map((skill, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {skill}
              </Badge>
            ))}
            {skills.length > 4 && (
              <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700">
                +{skills.length - 4}
              </Badge>
            )}
          </div>
        </div>

        <motion.div
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ opacity: x }}
        >
          <div className="bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg">
            Passer
          </div>
        </motion.div>

        <motion.div
          className="absolute right-4 top-1/2 -translate-y-1/2"
          style={{ opacity: x }}
        >
          <div className="bg-green-500/90 text-white px-4 py-2 rounded-lg shadow-lg">
            Like
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
}