
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";

interface ProfileCertificationsProps {
  certifications: UserProfile["certifications"];
}

export function ProfileCertifications({ certifications }: ProfileCertificationsProps) {
  return (
    <div className="space-y-6">
      {certifications && certifications.map((cert, index) => (
        <motion.div
          key={cert.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border rounded-lg p-4 space-y-2"
        >
          <h4 className="font-semibold text-lg">{cert.title}</h4>
          <p className="text-muted-foreground">{cert.institution}</p>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">{cert.year}</p>
            {cert.credential_url && (
              <a 
                href={cert.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Voir le certificat
              </a>
            )}
          </div>
          {cert.description && (
            <p className="text-sm mt-2">{cert.description}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
