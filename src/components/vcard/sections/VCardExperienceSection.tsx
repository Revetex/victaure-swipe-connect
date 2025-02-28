
import { useState } from "react";
import { PlusCircle, Trash2, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Experience, UserProfile } from "@/types/profile";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VCardExperienceSectionProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardExperienceSection({ profile, isEditing, setProfile }: VCardExperienceSectionProps) {
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [addingExperience, setAddingExperience] = useState(false);
  const [newExperience, setNewExperience] = useState<Experience>({
    id: crypto.randomUUID(),
    company: '',
    position: '',
    start_date: '',
    end_date: null,
    description: '',
  });

  const handleSaveExperience = (experience: Experience) => {
    const updatedExperiences = profile.experiences?.map(exp => 
      exp.id === experience.id ? experience : exp
    ) || [];
    
    setProfile({
      ...profile,
      experiences: updatedExperiences
    });
    
    setEditingExperience(null);
    toast.success("Expérience mise à jour");
  };

  const handleAddExperience = () => {
    if (!newExperience.company || !newExperience.position) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }
    
    const updatedExperiences = [
      ...(profile.experiences || []),
      newExperience
    ];
    
    setProfile({
      ...profile,
      experiences: updatedExperiences
    });
    
    setAddingExperience(false);
    setNewExperience({
      id: crypto.randomUUID(),
      company: '',
      position: '',
      start_date: '',
      end_date: null,
      description: '',
    });
    
    toast.success("Expérience ajoutée");
  };

  const handleDeleteExperience = (experienceId: string) => {
    const updatedExperiences = profile.experiences?.filter(exp => 
      exp.id !== experienceId
    ) || [];
    
    setProfile({
      ...profile,
      experiences: updatedExperiences
    });
    
    toast.success("Expérience supprimée");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'MMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Expériences professionnelles</h3>
        {isEditing && !addingExperience && !editingExperience && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setAddingExperience(true)}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Ajouter</span>
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {profile.experiences && profile.experiences.length > 0 ? (
          profile.experiences.map(experience => (
            editingExperience?.id === experience.id ? (
              <ExperienceForm 
                key={experience.id}
                experience={experience}
                onSubmit={handleSaveExperience}
                onCancel={() => setEditingExperience(null)}
              />
            ) : (
              <ExperienceCard 
                key={experience.id}
                experience={experience}
                onDelete={() => handleDeleteExperience(experience.id)}
                onEdit={() => setEditingExperience(experience)}
                isEditing={isEditing}
              />
            )
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            {isEditing ? "Ajoutez vos expériences professionnelles" : "Aucune expérience ajoutée"}
          </div>
        )}

        {addingExperience && (
          <ExperienceForm 
            experience={newExperience}
            onSubmit={handleAddExperience}
            onCancel={() => setAddingExperience(false)}
          />
        )}
      </div>
    </div>
  );
}

interface ExperienceCardProps {
  experience: Experience;
  onDelete: () => void;
  onEdit: () => void;
  isEditing: boolean;
}

function ExperienceCard({ experience, onDelete, onEdit, isEditing }: ExperienceCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'MMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card className="p-4 relative">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h4 className="font-medium">{experience.position}</h4>
          <div className="text-sm text-gray-500">
            {experience.company}
          </div>
          <div className="text-xs text-gray-400">
            {formatDate(experience.start_date)} - {experience.end_date ? formatDate(experience.end_date) : 'Présent'}
          </div>
          <p className="text-sm mt-2">{experience.description}</p>
        </div>
        {isEditing && (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

interface ExperienceFormProps {
  experience: Experience;
  onSubmit: (experience: Experience) => void;
  onCancel: () => void;
}

function ExperienceForm({ experience, onSubmit, onCancel }: ExperienceFormProps) {
  const [formData, setFormData] = useState<Experience>({ ...experience });
  const [isCurrent, setIsCurrent] = useState(!experience.end_date);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      end_date: isCurrent ? null : formData.end_date
    });
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="position">Poste</Label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              placeholder="Ex: Développeur Web"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Entreprise</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              placeholder="Ex: ABC Technologies"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="start_date">Date de début</Label>
            <Input
              id="start_date"
              name="start_date"
              type="date"
              value={formData.start_date?.slice(0, 10) || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">
              Date de fin
              <label className="ml-4 inline-flex items-center">
                <input
                  type="checkbox"
                  checked={isCurrent}
                  onChange={() => setIsCurrent(!isCurrent)}
                  className={cn(
                    "rounded-sm h-4 w-4",
                    "border border-gray-300 dark:border-gray-700",
                    "mr-2"
                  )}
                />
                <span className="text-sm">En cours</span>
              </label>
            </Label>
            <Input
              id="end_date"
              name="end_date"
              type="date"
              value={!isCurrent && formData.end_date ? formData.end_date.slice(0, 10) : ''}
              onChange={handleChange}
              disabled={isCurrent}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Décrivez vos responsabilités et réalisations..."
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </form>
    </Card>
  );
}
