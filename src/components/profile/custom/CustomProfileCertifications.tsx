
import { UserProfile, Certification } from "@/types/profile";
import { motion } from "framer-motion";
import { Award, Calendar, Link } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CustomProfileCertificationsProps {
  profile: UserProfile;
}

export function CustomProfileCertifications({ profile }: CustomProfileCertificationsProps) {
  const certifications = profile.certifications || [];

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

  if (!certifications || certifications.length === 0) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        custom={0.1}
        variants={variants}
        className="text-center p-12"
      >
        <Award className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
        <p className="text-muted-foreground">Aucune certification à afficher</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {certifications.map((cert: Certification, index) => (
        <motion.div
          key={cert.id || index}
          initial="hidden"
          animate="visible"
          custom={index * 0.1}
          variants={variants}
        >
          <Card className="p-6 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border border-border/30 overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
                    <Award className="h-5 w-5 text-primary/80" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground/90">{cert.title}</h3>
                    <p className="text-muted-foreground">{cert.issuer}</p>
                    {cert.credential_id && (
                      <p className="text-xs text-muted-foreground/70">ID: {cert.credential_id}</p>
                    )}
                  </div>
                </div>
                
                <Badge 
                  variant="secondary" 
                  className="flex items-center gap-1 bg-primary/10 text-primary border-primary/20 px-3 py-1 self-start"
                >
                  <Calendar className="h-3 w-3" />
                  <span>
                    {cert.issue_date ? formatDate(cert.issue_date) : ""}
                    {cert.expiry_date ? ` - ${formatDate(cert.expiry_date)}` : ""}
                  </span>
                </Badge>
              </div>
              
              {cert.description && (
                <div className="pl-2 border-l-2 border-primary/20 mt-2">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {cert.description}
                  </p>
                </div>
              )}

              {cert.credential_url && (
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-primary"
                    asChild
                  >
                    <a 
                      href={cert.credential_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1"
                    >
                      <Link className="h-3.5 w-3.5" />
                      Voir le certificat
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
