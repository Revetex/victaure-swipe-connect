import { VCardSection } from "./VCardSection";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { CertificationItem } from "./vcard/certifications/CertificationItem";

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

  const handleUpdateCertification = (index: number, field: keyof Certification, value: string) => {
    const newCertifications = [...(profile.certifications || [])];
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    setProfile({ ...profile, certifications: newCertifications });
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
              <CertificationItem
                cert={cert}
                index={index}
                isEditing={isEditing}
                onUpdate={handleUpdateCertification}
                onRemove={handleRemoveCertification}
              />
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