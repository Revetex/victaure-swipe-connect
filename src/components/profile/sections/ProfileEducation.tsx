
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
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
      <Card className="p-8 bg-card/50 backdrop-blur-sm">
        <div className="text-center text-muted-foreground">
          <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p>Aucune formation ajoutée</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 pb-4 mb-6 border-b border-border/50">
        <GraduationCap className="h-5 w-5 text-primary/80" />
        <h3 className="text-lg font-semibold text-foreground/90">Formation</h3>
      </div>

      <div className="space-y-8">
        {education.map((edu, index) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/60 hover:before:scale-150 before:transition-transform"
          >
            <div className="space-y-2">
              <h4 className="font-semibold text-lg text-foreground/90">
                {edu.degree}
              </h4>
              
              <p className="text-muted-foreground">
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
                <p className="text-sm text-muted-foreground/70 leading-relaxed mt-2">
                  {edu.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
