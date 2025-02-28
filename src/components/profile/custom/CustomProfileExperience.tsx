
import { Experience } from "@/types/profile";
import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CustomProfileExperienceProps {
  experiences?: Experience[];
}

export function CustomProfileExperience({ experiences = [] }: CustomProfileExperienceProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMM yyyy", { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0]
      } 
    })
  };

  if (!experiences || experiences.length === 0) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        custom={0.1}
        variants={variants}
        className="text-center p-12"
      >
        <Briefcase className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
        <p className="text-muted-foreground">Aucune expérience professionnelle à afficher</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {experiences.map((experience, index) => (
        <motion.div
          key={experience.id || index}
          initial="hidden"
          animate="visible"
          custom={index * 0.1}
          variants={variants}
        >
          <Card className="p-6 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border border-border/30 overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
                    <Briefcase className="h-5 w-5 text-primary/80" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground/90">{experience.position}</h3>
                    <p className="text-muted-foreground">{experience.company}</p>
                  </div>
                </div>
                
                <Badge 
                  variant="secondary" 
                  className="flex items-center gap-1 bg-primary/10 text-primary border-primary/20 px-3 py-1 self-start sm:self-auto"
                >
                  <Calendar className="h-3 w-3" />
                  <span>
                    {formatDate(experience.start_date)} 
                    {" - "} 
                    {experience.end_date ? formatDate(experience.end_date) : "Présent"}
                  </span>
                </Badge>
              </div>
              
              {experience.description && (
                <div className="pl-2 border-l-2 border-primary/20 mt-2">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {experience.description}
                  </p>
                </div>
              )}

              {/* Skills utilisés */}
              {experience.skills && experience.skills.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-foreground/70 mb-2">Compétences utilisées</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {experience.skills.map((skill, skillIndex) => (
                      <Badge 
                        key={skillIndex} 
                        variant="outline" 
                        className="bg-background/40 hover:bg-background/60 transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
