import { UserProfile } from "@/types/profile";
import { VCardSection } from "./VCardSection";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface VCardEducationProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardEducation({ profile, isEditing, setProfile }: VCardEducationProps) {
  const [newEducation, setNewEducation] = useState({
    school_name: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
  });

  const handleAddEducation = () => {
    if (!newEducation.school_name || !newEducation.degree) return;

    const education = {
      id: crypto.randomUUID(),
      ...newEducation
    };

    setProfile({
      ...profile,
      education: [...(profile.education || []), education]
    });

    setNewEducation({
      school_name: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
    });
  };

  const handleRemoveEducation = (id: string) => {
    setProfile({
      ...profile,
      education: profile.education?.filter(edu => edu.id !== id)
    });
  };

  return (
    <VCardSection title="Formation" icon={<GraduationCap className="h-5 w-5" />}>
      <div className="space-y-4">
        {profile.education?.map((education) => (
          <div key={education.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{education.degree}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {education.school_name}
                </p>
                {education.field_of_study && (
                  <p className="text-sm text-gray-500">
                    {education.field_of_study}
                  </p>
                )}
                {education.start_date && (
                  <p className="text-sm text-gray-500">
                    {new Date(education.start_date).getFullYear()} - 
                    {education.end_date 
                      ? new Date(education.end_date).getFullYear()
                      : "Présent"}
                  </p>
                )}
              </div>
              {isEditing && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveEducation(education.id)}
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
              placeholder="École"
              value={newEducation.school_name}
              onChange={(e) => setNewEducation({ 
                ...newEducation, 
                school_name: e.target.value 
              })}
            />
            <Input
              placeholder="Diplôme"
              value={newEducation.degree}
              onChange={(e) => setNewEducation({ 
                ...newEducation, 
                degree: e.target.value 
              })}
            />
            <Input
              placeholder="Domaine d'études"
              value={newEducation.field_of_study}
              onChange={(e) => setNewEducation({ 
                ...newEducation, 
                field_of_study: e.target.value 
              })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                placeholder="Date de début"
                value={newEducation.start_date}
                onChange={(e) => setNewEducation({ 
                  ...newEducation, 
                  start_date: e.target.value 
                })}
              />
              <Input
                type="date"
                placeholder="Date de fin"
                value={newEducation.end_date}
                onChange={(e) => setNewEducation({ 
                  ...newEducation, 
                  end_date: e.target.value 
                })}
              />
            </div>
            <Button
              onClick={handleAddEducation}
              className="w-full"
              disabled={!newEducation.school_name || !newEducation.degree}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une formation
            </Button>
          </div>
        )}
      </div>
    </VCardSection>
  );
}