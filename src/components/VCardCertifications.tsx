import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Award, Building2 } from "lucide-react";
import { VCardSection } from "./VCardSection";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useVCardStyle } from "./vcard/VCardStyleContext";

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
  const { selectedStyle } = useVCardStyle();

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
      icon={<Award className="h-5 w-5" style={{ color: selectedStyle.colors.primary }} />}
    >
      <AnimatePresence mode="popLayout">
        <div className="space-y-4">
          {(profile.certifications || []).map((cert: Certification, index: number) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative border-l-2 pl-4 py-3 space-y-3 hover:bg-white/5 rounded-r transition-colors"
              style={{ 
                borderColor: `${selectedStyle.colors.primary}30`,
                color: selectedStyle.colors.text.primary
              }}
            >
              {isEditing ? (
                <>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 shrink-0" style={{ color: selectedStyle.colors.primary }} />
                    <Input
                      value={cert.title}
                      onChange={(e) => {
                        const newCertifications = [...(profile.certifications || [])];
                        newCertifications[index].title = e.target.value;
                        setProfile({ ...profile, certifications: newCertifications });
                      }}
                      placeholder="Titre du diplôme/certification"
                      className="flex-1"
                      style={{
                        backgroundColor: `${selectedStyle.colors.primary}05`,
                        borderColor: `${selectedStyle.colors.primary}30`,
                        color: selectedStyle.colors.text.primary
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 shrink-0" style={{ color: selectedStyle.colors.primary }} />
                    <Input
                      value={cert.institution}
                      onChange={(e) => {
                        const newCertifications = [...(profile.certifications || [])];
                        newCertifications[index].institution = e.target.value;
                        setProfile({ ...profile, certifications: newCertifications });
                      }}
                      placeholder="Institution"
                      className="flex-1"
                      style={{
                        backgroundColor: `${selectedStyle.colors.primary}05`,
                        borderColor: `${selectedStyle.colors.primary}30`,
                        color: selectedStyle.colors.text.primary
                      }}
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
                      className="w-32"
                      style={{
                        backgroundColor: `${selectedStyle.colors.primary}05`,
                        borderColor: `${selectedStyle.colors.primary}30`,
                        color: selectedStyle.colors.text.primary
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCertification(index)}
                      className="hover:text-red-400 transition-colors"
                      style={{ color: selectedStyle.colors.primary }}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 shrink-0" style={{ color: selectedStyle.colors.primary }} />
                    <p className="font-medium text-lg" style={{ color: selectedStyle.colors.text.primary }}>{cert.title || "Titre non défini"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 shrink-0" style={{ color: selectedStyle.colors.primary }} />
                    <p style={{ color: selectedStyle.colors.text.secondary }}>{cert.institution || "Institution non définie"}</p>
                  </div>
                  <p className="text-sm" style={{ color: selectedStyle.colors.text.muted }}>{cert.year || "Année non définie"}</p>
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
                className="w-full mt-4"
                style={{
                  backgroundColor: selectedStyle.colors.primary,
                  borderColor: `${selectedStyle.colors.primary}50`,
                  color: "white"
                }}
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