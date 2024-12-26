import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
    <div>
      <h3 className="font-semibold mb-2">Certifications et Diplômes</h3>
      <div className="space-y-3">
        {profile.certifications.map((cert: Certification, index: number) => (
          <div key={index} className="border-l-2 border-victaure-blue pl-4">
            {isEditing ? (
              <>
                <Input
                  value={cert.title}
                  onChange={(e) => {
                    const newCertifications = [...profile.certifications];
                    newCertifications[index].title = e.target.value;
                    setProfile({ ...profile, certifications: newCertifications });
                  }}
                  placeholder="Titre du diplôme/certification"
                  className="mb-1"
                />
                <Input
                  value={cert.institution}
                  onChange={(e) => {
                    const newCertifications = [...profile.certifications];
                    newCertifications[index].institution = e.target.value;
                    setProfile({ ...profile, certifications: newCertifications });
                  }}
                  placeholder="Institution"
                  className="mb-1"
                />
                <div className="flex gap-2">
                  <Input
                    value={cert.year}
                    onChange={(e) => {
                      const newCertifications = [...profile.certifications];
                      newCertifications[index].year = e.target.value;
                      setProfile({ ...profile, certifications: newCertifications });
                    }}
                    placeholder="Année"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCertification(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="font-medium">{cert.title}</p>
                <p className="text-sm text-victaure-gray-dark">{cert.institution}</p>
                <p className="text-sm text-victaure-gray-dark">{cert.year}</p>
              </>
            )}
          </div>
        ))}
        {isEditing && (
          <Button onClick={handleAddCertification} variant="outline" className="w-full">
            Ajouter une certification/diplôme
          </Button>
        )}
      </div>
    </div>
  );
}