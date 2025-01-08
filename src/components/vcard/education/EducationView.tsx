import { motion } from "framer-motion";
import { Building2, GraduationCap, Calendar } from "lucide-react";
import { Education } from "@/types/profile";

interface EducationViewProps {
  education: Education;
}

export function EducationView({ education }: EducationViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative bg-white/5 backdrop-blur-sm rounded-lg p-4 space-y-4 border border-indigo-500/20"
    >
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-indigo-400 shrink-0" />
        <p className="font-medium text-white">{education.school_name || "École non définie"}</p>
      </div>
      <div className="flex items-center gap-2">
        <GraduationCap className="h-4 w-4 text-indigo-400 shrink-0" />
        <p className="text-white/80">{education.degree || "Diplôme non défini"}</p>
      </div>
      {education.field_of_study && (
        <p className="text-white/70 pl-6">{education.field_of_study}</p>
      )}
      <div className="flex items-center gap-2 text-sm text-white/60">
        <Calendar className="h-4 w-4" />
        <span>
          {education.start_date ? new Date(education.start_date).getFullYear() : "?"} 
          {" - "}
          {education.end_date ? new Date(education.end_date).getFullYear() : "Présent"}
        </span>
      </div>
    </motion.div>
  );
}