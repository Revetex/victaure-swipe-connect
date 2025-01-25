import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Award, Building2 } from "lucide-react";
import { VCardSection } from "./VCardSection";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Certification {
  title: string;
  institution: string;
  year: string;
}

interface VCardCertificationsProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardCertifications({
  profile,
  isEditing,
  setProfile,
}: VCardCertificationsProps) {
  const handleAddCertification = () => {
    setProfile({
      ...profile,
      certifications: [
        ...(profile.certifications || []),
        { title: "", institution: "", year: "" },
      ],
    });
    toast.success("Certification ajoutée");
  };

  const handleRemoveCertification = (index: number) => {
    const newCertifications = [...(profile.certifications || [])];
    newCertifications.splice(index, 1);
    setProfile({ ...profile, certifications: newCertifications });
    toast.success("Certification supprimée");
  };

  return (
    <VCardSection 
      title="Certifications et Diplômes"
      icon={<Award className="h-5 w-5 text-indigo-400" />}
    >
      <AnimatePresence mode="popLayout">
        <div className="space-y-4">
          {(profile.certifications || []).map((cert: Certification, index: number) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative border-l-2 border-indigo-500/30 pl-4 py-3 space-y-3 hover:bg-white/5 rounded-r transition-colors"
            >
              {isEditing ? (
                <>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-indigo-400 shrink-0" />
                    <Input
                      value={cert.title}
                      onChange={(e) => {
                        const newCertifications = [...(profile.certifications || [])];
                        newCertifications[index].title = e.target.value;
                        setProfile({ ...profile, certifications: newCertifications });
                      }}
                      placeholder="Titre du diplôme/certification"
                      className="flex-1 bg-white/10 border-indigo-500/20"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-indigo-400 shrink-0" />
                    <Input
                      value={cert.institution}
                      onChange={(e) => {
                        const newCertifications = [...(profile.certifications || [])];
                        newCertifications[index].institution = e.target.value;
                        setProfile({ ...profile, certifications: newCertifications });
                      }}
                      placeholder="Institution"
                      className="flex-1 bg-white/10 border-indigo-500/20"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={cert.year}
                      onChange={(e) => {
                        const newCertifications = [...(profile.certifications || [])];
                        newCertifications[index].year = e.target.value;
                        setProfile({ ...profile, certifications: newCertifications });
                      }}
                      placeholder="Année"
                      className="w-32 bg-white/10 border-indigo-500/20"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCertification(index)}
                      className="text-indigo-400 hover:text-red-400 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-indigo-400 shrink-0" />
                    <p className="font-medium text-lg text-white">{cert.title || "Titre non défini"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-indigo-400 shrink-0" />
                    <p className="text-white/80">{cert.institution || "Institution non définie"}</p>
                  </div>
                  <p className="text-sm text-white/60">{cert.year || "Année non définie"}</p>
                </>
              )}
            </motion.div>
          ))}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button 
                onClick={handleAddCertification} 
                variant="outline" 
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500"
              >
                Ajouter une certification/diplôme
              </Button>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </VCardSection>
  );
}