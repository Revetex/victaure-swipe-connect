import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Briefcase, Building2, Calendar } from "lucide-react";
import { VCardSection } from "./VCardSection";
import { Textarea } from "./ui/textarea";

interface Experience {
  company: string;
  position: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

interface VCardExperiencesProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardExperiences({
  profile,
  isEditing,
  setProfile,
}: VCardExperiencesProps) {
  const handleAddExperience = () => {
    setProfile({
      ...profile,
      experiences: [
        ...(profile.experiences || []),
        { company: "", position: "", start_date: "", end_date: "", description: "" },
      ],
    });
  };

  const handleRemoveExperience = (index: number) => {
    const newExperiences = [...(profile.experiences || [])];
    newExperiences.splice(index, 1);
    setProfile({ ...profile, experiences: newExperiences });
  };

  return (
    <VCardSection 
      title="Expériences Professionnelles"
      icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="space-y-4">
        {(profile.experiences || []).map((exp: Experience, index: number) => (
          <div key={index} className="relative border-l-2 border-primary/30 pl-4 py-2 space-y-2 hover:bg-muted/50 rounded-r transition-colors">
            {isEditing ? (
              <>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    value={exp.company}
                    onChange={(e) => {
                      const newExperiences = [...(profile.experiences || [])];
                      newExperiences[index].company = e.target.value;
                      setProfile({ ...profile, experiences: newExperiences });
                    }}
                    placeholder="Nom de l'entreprise"
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    value={exp.position}
                    onChange={(e) => {
                      const newExperiences = [...(profile.experiences || [])];
                      newExperiences[index].position = e.target.value;
                      setProfile({ ...profile, experiences: newExperiences });
                    }}
                    placeholder="Poste"
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                      type="date"
                      value={exp.start_date}
                      onChange={(e) => {
                        const newExperiences = [...(profile.experiences || [])];
                        newExperiences[index].start_date = e.target.value;
                        setProfile({ ...profile, experiences: newExperiences });
                      }}
                      className="flex-1"
                    />
                    <span className="mx-2">-</span>
                    <Input
                      type="date"
                      value={exp.end_date}
                      onChange={(e) => {
                        const newExperiences = [...(profile.experiences || [])];
                        newExperiences[index].end_date = e.target.value;
                        setProfile({ ...profile, experiences: newExperiences });
                      }}
                      className="flex-1"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveExperience(index)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  value={exp.description}
                  onChange={(e) => {
                    const newExperiences = [...(profile.experiences || [])];
                    newExperiences[index].description = e.target.value;
                    setProfile({ ...profile, experiences: newExperiences });
                  }}
                  placeholder="Description du poste"
                  className="mt-2"
                />
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="font-medium">{exp.company || "Entreprise non définie"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="text-sm text-muted-foreground">{exp.position || "Poste non défini"}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {exp.start_date ? new Date(exp.start_date).getFullYear() : "?"} 
                    {" - "}
                    {exp.end_date ? new Date(exp.end_date).getFullYear() : "Présent"}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                )}
              </>
            )}
          </div>
        ))}
        {isEditing && (
          <Button 
            onClick={handleAddExperience} 
            variant="outline" 
            className="w-full mt-4"
          >
            Ajouter une expérience
          </Button>
        )}
      </div>
    </VCardSection>
  );
}