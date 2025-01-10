import { UserProfile, Certification } from "@/types/profile";
import { VCardSection } from "./VCardSection";
import { Award, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface VCardCertificationsProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardCertifications({ profile, isEditing, setProfile }: VCardCertificationsProps) {
  const [newCertification, setNewCertification] = useState<Partial<Certification>>({
    title: "",
    issuer: "",
    issue_date: "",
    expiry_date: "",
    credential_url: "",
    institution: "",
    year: new Date().getFullYear().toString(),
  });

  const handleAddCertification = () => {
    if (!newCertification.title || !newCertification.issuer) return;

    const certification: Certification = {
      id: crypto.randomUUID(),
      profile_id: profile.id,
      title: newCertification.title || "",
      issuer: newCertification.issuer || "",
      issue_date: newCertification.issue_date || null,
      expiry_date: newCertification.expiry_date || null,
      credential_url: newCertification.credential_url || null,
      institution: newCertification.institution || "",
      year: newCertification.year || new Date().getFullYear().toString(),
      created_at: null,
      updated_at: null,
      description: null,
      skills: []
    };

    setProfile({
      ...profile,
      certifications: [...(profile.certifications || []), certification]
    });

    setNewCertification({
      title: "",
      issuer: "",
      issue_date: "",
      expiry_date: "",
      credential_url: "",
      institution: "",
      year: new Date().getFullYear().toString(),
    });
  };

  const handleRemoveCertification = (id: string) => {
    setProfile({
      ...profile,
      certifications: profile.certifications?.filter(cert => cert.id !== id)
    });
  };

  return (
    <VCardSection title="Certifications" icon={<Award className="h-5 w-5" />}>
      <div className="space-y-4">
        {profile.certifications?.map((certification) => (
          <div key={certification.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{certification.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {certification.issuer}
                </p>
                {certification.issue_date && (
                  <p className="text-sm text-gray-500">
                    Obtenue le {new Date(certification.issue_date).toLocaleDateString()}
                    {certification.expiry_date && 
                      ` - Expire le ${new Date(certification.expiry_date).toLocaleDateString()}`
                    }
                  </p>
                )}
                {certification.credential_url && (
                  <a 
                    href={certification.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Voir le certificat
                  </a>
                )}
              </div>
              {isEditing && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCertification(certification.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}

        {isEditing && (
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Input
              placeholder="Titre de la certification"
              value={newCertification.title}
              onChange={(e) => setNewCertification({ 
                ...newCertification, 
                title: e.target.value 
              })}
            />
            <Input
              placeholder="Organisme certificateur"
              value={newCertification.issuer}
              onChange={(e) => setNewCertification({ 
                ...newCertification, 
                issuer: e.target.value 
              })}
            />
            <Input
              placeholder="Institution"
              value={newCertification.institution}
              onChange={(e) => setNewCertification({ 
                ...newCertification, 
                institution: e.target.value 
              })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                placeholder="Date d'obtention"
                value={newCertification.issue_date}
                onChange={(e) => setNewCertification({ 
                  ...newCertification, 
                  issue_date: e.target.value 
                })}
              />
              <Input
                type="date"
                placeholder="Date d'expiration"
                value={newCertification.expiry_date}
                onChange={(e) => setNewCertification({ 
                  ...newCertification, 
                  expiry_date: e.target.value 
                })}
              />
            </div>
            <Input
              placeholder="URL du certificat"
              value={newCertification.credential_url}
              onChange={(e) => setNewCertification({ 
                ...newCertification, 
                credential_url: e.target.value 
              })}
            />
            <Button
              onClick={handleAddCertification}
              className="w-full"
              disabled={!newCertification.title || !newCertification.issuer}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une certification
            </Button>
          </div>
        )}
      </div>
    </VCardSection>
  );
}