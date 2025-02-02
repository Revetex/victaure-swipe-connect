import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Education } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VCardEducationProps {
  profile: {
    id: string;
    education?: Education[];
  };
  isEditing?: boolean;
  setProfile: (profile: any) => void;
}

export function VCardEducation({ profile, isEditing, setProfile }: VCardEducationProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newEducation, setNewEducation] = useState<Partial<Education>>({
    school_name: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  // Ensure education is always an array
  const educationList = profile?.education || [];

  const handleAddEducation = async () => {
    try {
      // Validate required fields
      if (!newEducation.school_name || !newEducation.degree) {
        toast.error("Le nom de l'école et le diplôme sont requis");
        return;
      }

      const { data: education, error } = await supabase
        .from('education')
        .insert([
          {
            profile_id: profile.id,
            school_name: newEducation.school_name,
            degree: newEducation.degree,
            field_of_study: newEducation.field_of_study,
            start_date: newEducation.start_date,
            end_date: newEducation.end_date,
            description: newEducation.description,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setProfile({
        ...profile,
        education: [...educationList, education],
      });

      setIsAdding(false);
      setNewEducation({
        school_name: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        description: "",
      });

      toast.success("Formation ajoutée avec succès");
    } catch (error: any) {
      console.error('Error adding education:', error);
      toast.error(error.message || "Erreur lors de l'ajout de la formation");
    }
  };

  const handleDeleteEducation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProfile({
        ...profile,
        education: educationList.filter((edu: Education) => edu.id !== id),
      });

      toast.success("Formation supprimée avec succès");
    } catch (error: any) {
      console.error('Error deleting education:', error);
      toast.error(error.message || "Erreur lors de la suppression de la formation");
    }
  };

  if (!isEditing && educationList.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Formation</h3>
        {isEditing && !isAdding && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="space-y-4 p-4 border rounded-lg">
          <input
            type="text"
            placeholder="Nom de l'école"
            value={newEducation.school_name || ""}
            onChange={(e) => setNewEducation({ ...newEducation, school_name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Diplôme"
            value={newEducation.degree || ""}
            onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Domaine d'étude"
            value={newEducation.field_of_study || ""}
            onChange={(e) => setNewEducation({ ...newEducation, field_of_study: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              placeholder="Date de début"
              value={newEducation.start_date || ""}
              onChange={(e) => setNewEducation({ ...newEducation, start_date: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="date"
              placeholder="Date de fin"
              value={newEducation.end_date || ""}
              onChange={(e) => setNewEducation({ ...newEducation, end_date: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <textarea
            placeholder="Description"
            value={newEducation.description || ""}
            onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAdding(false);
                setNewEducation({
                  school_name: "",
                  degree: "",
                  field_of_study: "",
                  start_date: "",
                  end_date: "",
                  description: "",
                });
              }}
            >
              Annuler
            </Button>
            <Button onClick={handleAddEducation}>Ajouter</Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {educationList.map((education: Education) => (
          <div key={education.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{education.school_name}</h4>
                <p className="text-sm text-gray-600">{education.degree}</p>
                {education.field_of_study && (
                  <p className="text-sm text-gray-600">{education.field_of_study}</p>
                )}
                {education.start_date && education.end_date && (
                  <p className="text-sm text-gray-600">
                    {new Date(education.start_date).toLocaleDateString()} -{" "}
                    {new Date(education.end_date).toLocaleDateString()}
                  </p>
                )}
                {education.description && (
                  <p className="mt-2 text-sm text-gray-600">{education.description}</p>
                )}
              </div>
              {isEditing && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteEducation(education.id)}
                >
                  Supprimer
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}