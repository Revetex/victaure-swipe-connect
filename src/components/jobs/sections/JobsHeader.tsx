import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";
interface JobsHeaderProps {
  totalJobs: number;
}
export function JobsHeader({
  totalJobs
}: JobsHeaderProps) {
  return <motion.div className="flex flex-col space-y-4" variants={{
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1
    }
  }}>
      <div className="flex items-center justify-start gap-3">
        <Briefcase className="h-8 w-8 text-primary shrink-0" />
        <h1 className="text-3xl font-bold tracking-tight truncate">Offres d'emploi</h1>
      </div>
      
    </motion.div>;
}