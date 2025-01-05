import { Job } from "@/types/job";
import { JobBadge } from "./JobBadge";
import { Globe, MapPin, DollarSign, Briefcase, Clock, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

interface JobBadgesProps {
  job: Job;
  displaySalary?: string;
}

export function JobBadges({ job, displaySalary }: JobBadgesProps) {
  const { 
    location, 
    remote_type, 
    contract_type, 
    experience_level,
    education_level,
    years_of_experience 
  } = job;

  return (
    <motion.div 
      className="flex flex-wrap gap-2 mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <JobBadge
        icon={remote_type === 'remote' ? Globe : MapPin}
        label={`${location}${remote_type && remote_type !== 'on-site' ? ` (${remote_type})` : ''}`}
        tooltip={remote_type === 'remote' ? 'Travail à distance' : 'Sur site'}
      />
      
      {displaySalary && (
        <JobBadge
          icon={DollarSign}
          label={displaySalary}
          tooltip="Budget/Salaire"
          colorClass="bg-green-500/10 hover:bg-green-500/20"
        />
      )}

      <JobBadge
        icon={Briefcase}
        label={contract_type}
        tooltip="Type de contrat"
        colorClass="bg-blue-500/10 hover:bg-blue-500/20"
      />

      <JobBadge
        icon={Clock}
        label={`${experience_level}${years_of_experience > 0 ? ` (${years_of_experience}+ ans)` : ''}`}
        tooltip="Expérience requise"
        colorClass="bg-purple-500/10 hover:bg-purple-500/20"
      />

      {education_level && (
        <JobBadge
          icon={GraduationCap}
          label={education_level}
          tooltip="Niveau d'études"
          colorClass="bg-orange-500/10 hover:bg-orange-500/20"
        />
      )}
    </motion.div>
  );
}