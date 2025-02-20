
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ProfileEducationProps {
  education: UserProfile["education"];
}

export function ProfileEducation({ education }: ProfileEducationProps) {
  const formatExperience = (startDate?: string, endDate?: string) => {
    if (!startDate) return "";
    const start = format(new Date(startDate), 'MMM yyyy', { locale: fr });
    const end = endDate ? format(new Date(endDate), 'MMM yyyy', { locale: fr }) : "Présent";
    return `${start} - ${end}`;
  };

  return (
    <div className="space-y-6">
      {education && education.map((edu, index) => (
        <motion.div
          key={edu.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border rounded-lg p-4 space-y-2"
        >
          <h4 className="font-semibold text-lg">{edu.degree}</h4>
          <p className="text-muted-foreground">{edu.school_name}</p>
          {edu.field_of_study && (
            <p className="text-sm text-muted-foreground">{edu.field_of_study}</p>
          )}
          <p className="text-sm text-muted-foreground">
            {formatExperience(edu.start_date, edu.end_date)}
          </p>
          {edu.description && (
            <p className="text-sm mt-2">{edu.description}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
