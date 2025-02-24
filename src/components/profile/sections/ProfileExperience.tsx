
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

interface ProfileExperienceProps {
  experiences: UserProfile["experiences"];
}

export function ProfileExperience({ experiences }: ProfileExperienceProps) {
  const formatExperience = (startDate?: string, endDate?: string) => {
    if (!startDate) return "";
    const start = format(new Date(startDate), 'MMM yyyy', { locale: fr });
    const end = endDate ? format(new Date(endDate), 'MMM yyyy', { locale: fr }) : "Présent";
    return `${start} - ${end}`;
  };

  return (
    <Card className="p-6 space-y-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex items-center gap-2 pb-4 border-b border-border/50">
        <Briefcase className="h-5 w-5 text-primary/80" />
        <h3 className="text-lg font-semibold">Expérience professionnelle</h3>
      </div>

      <div className="space-y-6">
        {experiences && experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <div className="absolute -left-3 top-2 w-1.5 h-1.5 rounded-full bg-primary/60 
                          group-hover:scale-150 transition-transform duration-300" />
            
            <div className="pl-6 space-y-2">
              <h4 className="font-semibold text-lg text-foreground/90 group-hover:text-primary/90 
                           transition-colors duration-300">
                {exp.position}
              </h4>
              
              <p className="text-muted-foreground/90">{exp.company}</p>
              
              <p className="text-sm text-muted-foreground/80">
                {formatExperience(exp.start_date, exp.end_date)}
              </p>
              
              {exp.description && (
                <p className="text-sm text-muted-foreground/70 mt-2 leading-relaxed">
                  {exp.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}

        {(!experiences || experiences.length === 0) && (
          <div className="text-center py-8 text-muted-foreground/60">
            Aucune expérience ajoutée
          </div>
        )}
      </div>
    </Card>
  );
}
