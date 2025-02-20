
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
    <div className="space-y-6">
      {experiences && experiences.map((exp, index) => (
        <motion.div
          key={exp.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border rounded-lg p-4 space-y-2"
        >
          <h4 className="font-semibold text-lg">{exp.position}</h4>
          <p className="text-muted-foreground">{exp.company}</p>
          <p className="text-sm text-muted-foreground">
            {formatExperience(exp.start_date, exp.end_date)}
          </p>
          {exp.description && (
            <p className="text-sm mt-2">{exp.description}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
