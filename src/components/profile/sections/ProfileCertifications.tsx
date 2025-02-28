
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Award, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileCertificationsProps {
  certifications: UserProfile["certifications"];
}

export function ProfileCertifications({ certifications }: ProfileCertificationsProps) {
  if (!certifications?.length) {
    return (
      <Card className="p-8 bg-card/50 backdrop-blur-sm">
        <div className="text-center text-muted-foreground">
          <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p>Aucune certification ajoutée</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 pb-4 mb-6 border-b border-border/50">
        <Award className="h-5 w-5 text-primary/80" />
        <h3 className="text-lg font-semibold text-foreground/90">Certifications</h3>
      </div>

      <div className="grid gap-6">
        {certifications.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors duration-300"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <h4 className="font-semibold text-lg text-foreground/90 group-hover:text-primary/90 transition-colors">
                  {cert.title}
                </h4>
                {cert.credential_url && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    asChild
                  >
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
              
              <p className="text-muted-foreground">
                {cert.issuer}
              </p>
              
              <p className="text-sm text-muted-foreground/80">
                {cert.year}
              </p>
              
              {cert.description && (
                <p className="text-sm text-muted-foreground/70 leading-relaxed mt-2">
                  {cert.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
