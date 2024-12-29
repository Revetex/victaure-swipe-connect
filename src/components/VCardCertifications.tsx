import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Award, Building2, GraduationCap } from "lucide-react";
import { VCardSection } from "./VCardSection";

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
        ...profile.certifications,
        { title: "", institution: "", year: "" },
      ],
    });
  };

  const handleRemoveCertification = (index: number) => {
    const newCertifications = [...profile.certifications];
    newCertifications.splice(index, 1);
    setProfile({ ...profile, certifications: newCertifications });
  };

  return (
    <VCardSection 
      title="Certifications et Diplômes"
      icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="space-y-4">
        {profile.certifications.map((cert: Certification, index: number) => (
          <div key={index} className="relative border-l-2 border-primary/30 pl-4 py-2 space-y-2 hover:bg-muted/50 rounded-r transition-colors">
            {isEditing ? (
              <>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    value={cert.title}
                    onChange={(e) => {
                      const newCertifications = [...profile.certifications];
                      newCertifications[index].title = e.target.value;
                      setProfile({ ...profile, certifications: newCertifications });
                    }}
                    placeholder="Titre du diplôme/certification"
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    value={cert.institution}
                    onChange={(e) => {
                      const newCertifications = [...profile.certifications];
                      newCertifications[index].institution = e.target.value;
                      setProfile({ ...profile, certifications: newCertifications });
                    }}
                    placeholder="Institution"
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    value={cert.year}
                    onChange={(e) => {
                      const newCertifications = [...profile.certifications];
                      newCertifications[index].year = e.target.value;
                      setProfile({ ...profile, certifications: newCertifications });
                    }}
                    placeholder="Année"
                    className="w-32"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCertification(index)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="font-medium">{cert.title || "Titre non défini"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="text-sm text-muted-foreground">{cert.institution || "Institution non définie"}</p>
                </div>
                <p className="text-sm text-muted-foreground">{cert.year || "Année non définie"}</p>
              </>
            )}
          </div>
        ))}
        {isEditing && (
          <Button 
            onClick={handleAddCertification} 
            variant="outline" 
            className="w-full mt-4"
          >
            Ajouter une certification/diplôme
          </Button>
        )}
      </div>
    </VCardSection>
  );
}