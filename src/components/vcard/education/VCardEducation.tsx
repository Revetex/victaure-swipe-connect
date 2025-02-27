
import { useState } from 'react';
import { UserProfile, Education } from '@/types/profile';
import { format, parseISO } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash, Pencil, Calendar, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

interface VCardEducationProps {
  profile: UserProfile;
  isEditing: boolean;
  onUpdate: (profile: UserProfile) => void;
}

export function VCardEducation({ profile, isEditing, onUpdate }: VCardEducationProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [newEducation, setNewEducation] = useState<Education>({
    id: crypto.randomUUID(),
    school_name: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: null,
    description: ''
  });

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '';
    try {
      return format(parseISO(date), 'yyyy');
    } catch (error) {
      return date;
    }
  };

  const handleAddEducation = () => {
    if (!newEducation.school_name || !newEducation.degree) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    const updatedEducation = [...(profile.education || []), newEducation];
    
    onUpdate({
      ...profile,
      education: updatedEducation
    });
    
    setIsAdding(false);
    setNewEducation({
      id: crypto.randomUUID(),
      school_name: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: null,
      description: ''
    });
    
    toast.success('Formation ajoutée');
  };

  const handleUpdateEducation = () => {
    if (!editingEducation) return;
    
    const updatedEducation = profile.education?.map(edu => 
      edu.id === editingEducation.id ? editingEducation : edu
    ) || [];
    
    onUpdate({
      ...profile,
      education: updatedEducation
    });
    
    setEditingEducation(null);
    toast.success('Formation mise à jour');
  };

  const handleDeleteEducation = (id: string) => {
    const updatedEducation = profile.education?.filter(edu => edu.id !== id) || [];
    
    onUpdate({
      ...profile,
      education: updatedEducation
    });
    
    toast.success('Formation supprimée');
  };

  const handleChangeNewEducation = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEducation(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeEditingEducation = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingEducation) return;
    
    const { name, value } = e.target;
    setEditingEducation(prev => ({ ...prev!, [name]: value }));
  };

  return (
    <div>
      {profile.education && profile.education.length > 0 ? (
        <div className="space-y-4">
          {profile.education.map((education) => (
            <div key={education.id}>
              {editingEducation?.id === education.id ? (
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label htmlFor="school_name">Établissement</Label>
                      <Input
                        id="school_name"
                        name="school_name"
                        value={editingEducation.school_name}
                        onChange={handleChangeEditingEducation}
                      />
                    </div>
                    <div>
                      <Label htmlFor="degree">Diplôme</Label>
                      <Input
                        id="degree"
                        name="degree"
                        value={editingEducation.degree}
                        onChange={handleChangeEditingEducation}
                      />
                    </div>
                    <div>
                      <Label htmlFor="field_of_study">Domaine d'étude</Label>
                      <Input
                        id="field_of_study"
                        name="field_of_study"
                        value={editingEducation.field_of_study || ''}
                        onChange={handleChangeEditingEducation}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start_date">Date de début</Label>
                        <Input
                          id="start_date"
                          name="start_date"
                          type="date"
                          value={editingEducation.start_date?.toString().slice(0, 10) || ''}
                          onChange={handleChangeEditingEducation}
                        />
                      </div>
                      <div>
                        <Label htmlFor="end_date">Date de fin</Label>
                        <Input
                          id="end_date"
                          name="end_date"
                          type="date"
                          value={editingEducation.end_date?.toString().slice(0, 10) || ''}
                          onChange={handleChangeEditingEducation}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={editingEducation.description || ''}
                        onChange={handleChangeEditingEducation}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditingEducation(null)}
                      >
                        Annuler
                      </Button>
                      <Button onClick={handleUpdateEducation}>
                        Enregistrer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{education.degree}</h3>
                        <p className="text-sm text-gray-600">{education.school_name}</p>
                        {education.field_of_study && (
                          <p className="text-sm text-gray-500">{education.field_of_study}</p>
                        )}
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {formatDate(education.start_date)} 
                            {education.end_date ? ` - ${formatDate(education.end_date)}` : ' - Présent'}
                          </span>
                        </div>
                        {education.description && (
                          <p className="text-sm mt-2">{education.description}</p>
                        )}
                      </div>
                      {isEditing && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingEducation(education)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteEducation(education.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      ) : !isAdding ? (
        <div className="text-center py-8 text-gray-500">
          {isEditing ? (
            <p>Ajoutez vos formations pour compléter votre profil</p>
          ) : (
            <p>Aucune formation ajoutée</p>
          )}
        </div>
      ) : null}

      {isEditing && !isAdding && !editingEducation && (
        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter une formation
        </Button>
      )}

      {isAdding && (
        <Card className="mt-4">
          <CardContent className="p-4 space-y-4">
            <div>
              <Label htmlFor="school_name">Établissement</Label>
              <Input
                id="school_name"
                name="school_name"
                value={newEducation.school_name}
                onChange={handleChangeNewEducation}
                placeholder="Ex: Université de Montréal"
              />
            </div>
            <div>
              <Label htmlFor="degree">Diplôme</Label>
              <Input
                id="degree"
                name="degree"
                value={newEducation.degree}
                onChange={handleChangeNewEducation}
                placeholder="Ex: Master en informatique"
              />
            </div>
            <div>
              <Label htmlFor="field_of_study">Domaine d'étude</Label>
              <Input
                id="field_of_study"
                name="field_of_study"
                value={newEducation.field_of_study || ''}
                onChange={handleChangeNewEducation}
                placeholder="Ex: Sciences informatiques"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Date de début</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={newEducation.start_date || ''}
                  onChange={handleChangeNewEducation}
                />
              </div>
              <div>
                <Label htmlFor="end_date">Date de fin</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={newEducation.end_date?.toString() || ''}
                  onChange={handleChangeNewEducation}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newEducation.description || ''}
                onChange={handleChangeNewEducation}
                rows={3}
                placeholder="Décrivez votre formation..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAdding(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleAddEducation}>
                Ajouter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
