
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { GraduationCap } from "lucide-react";

interface ProfileEducationProps {
  education: UserProfile["education"];
}

export function ProfileEducation({ education }: ProfileEducationProps) {
  const formatEducation = (startDate?: string, endDate?: string) => {
    if (!startDate) return "";
    const start = format(new Date(startDate), 'MMM yyyy', { locale: fr });
    const end = endDate ? format(new Date(endDate), 'MMM yyyy', { locale: fr }) : "Présent";
    return `${start} - ${end}`;
  };

  if (!education?.length) {
    return (
      <div className="text-center p-8">
        <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-muted-foreground">Aucune formation ajoutée</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="p-2.5 rounded-xl bg-accent/10 text-primary">
          <GraduationCap className="h-5 w-5" />
        </span>
        <h3 className="text-gradient text-lg">Formation</h3>
      </div>

      <div className="space-y-8">
        {education.map((edu, index) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-6 hover-float group"
          >
            <div className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-accent/60 
                          group-hover:scale-150 group-hover:bg-accent transition-all duration-300" />
            <div className="space-y-2">
              <h4 className="font-semibold text-lg text-foreground/90 group-hover:text-gradient">
                {edu.degree}
              </h4>
              
              <p className="text-muted-foreground group-hover:text-foreground/90 transition-colors">
                {edu.school_name}
              </p>
              
              {edu.field_of_study && (
                <p className="text-sm text-muted-foreground/90">
                  {edu.field_of_study}
                </p>
              )}
              
              <p className="text-sm text-muted-foreground/80">
                {formatEducation(edu.start_date, edu.end_date)}
              </p>
              
              {edu.description && (
                <p className="text-sm text-muted-foreground/70 leading-relaxed mt-2
                            group-hover:text-muted-foreground/90 transition-colors">
                  {edu.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
