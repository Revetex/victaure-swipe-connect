import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, GraduationCap, Building2, Calendar } from "lucide-react";
import { VCardSection } from "./VCardSection";

interface Education {
  school_name: string;
  degree: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
}

interface VCardEducationProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardEducation({
  profile,
  isEditing,
  setProfile,
}: VCardEducationProps) {
  const handleAddEducation = () => {
    setProfile({
      ...profile,
      education: [
        ...(profile.education || []),
        { school_name: "", degree: "", field_of_study: "", start_date: "", end_date: "" },
      ],
    });
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = [...(profile.education || [])];
    newEducation.splice(index, 1);
    setProfile({ ...profile, education: newEducation });
  };

  return (
    <VCardSection 
      title="Formation"
      icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="space-y-4">
        {(profile.education || []).map((edu: Education, index: number) => (
          <div key={index} className="relative border-l-2 border-primary/30 pl-4 py-2 space-y-2 hover:bg-muted/50 rounded-r transition-colors">
            {isEditing ? (
              <>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    value={edu.school_name}
                    onChange={(e) => {
                      const newEducation = [...(profile.education || [])];
                      newEducation[index].school_name = e.target.value;
                      setProfile({ ...profile, education: newEducation });
                    }}
                    placeholder="Nom de l'école"
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    value={edu.degree}
                    onChange={(e) => {
                      const newEducation = [...(profile.education || [])];
                      newEducation[index].degree = e.target.value;
                      setProfile({ ...profile, education: newEducation });
                    }}
                    placeholder="Diplôme"
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={edu.field_of_study}
                    onChange={(e) => {
                      const newEducation = [...(profile.education || [])];
                      newEducation[index].field_of_study = e.target.value;
                      setProfile({ ...profile, education: newEducation });
                    }}
                    placeholder="Domaine d'études"
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                      type="date"
                      value={edu.start_date}
                      onChange={(e) => {
                        const newEducation = [...(profile.education || [])];
                        newEducation[index].start_date = e.target.value;
                        setProfile({ ...profile, education: newEducation });
                      }}
                      className="flex-1"
                    />
                    <span className="mx-2">-</span>
                    <Input
                      type="date"
                      value={edu.end_date}
                      onChange={(e) => {
                        const newEducation = [...(profile.education || [])];
                        newEducation[index].end_date = e.target.value;
                        setProfile({ ...profile, education: newEducation });
                      }}
                      className="flex-1"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveEducation(index)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="font-medium">{edu.school_name || "École non définie"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="text-sm text-muted-foreground">{edu.degree || "Diplôme non défini"}</p>
                </div>
                {edu.field_of_study && (
                  <p className="text-sm text-muted-foreground">{edu.field_of_study}</p>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {edu.start_date ? new Date(edu.start_date).getFullYear() : "?"} 
                    {" - "}
                    {edu.end_date ? new Date(edu.end_date).getFullYear() : "Présent"}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
        {isEditing && (
          <Button 
            onClick={handleAddEducation} 
            variant="outline" 
            className="w-full mt-4"
          >
            Ajouter une formation
          </Button>
        )}
      </div>
    </VCardSection>
  );
}