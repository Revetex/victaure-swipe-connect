import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { VCardSkeleton } from "./vcard/VCardSkeleton";
import { VCardEmpty } from "./vcard/VCardEmpty";
import { VCardHeader } from "./VCardHeader";
import { VCardContact } from "./VCardContact";
import { toast } from "sonner";
import { VCardContent } from "./vcard/VCardContent";
import { supabase } from "@/integrations/supabase/client";
import { updateProfile } from "@/utils/profileActions";
import { VCardContainer } from "./vcard/VCardContainer";
import { VCardFooter } from "./vcard/VCardFooter";
import { generateBusinessCard, generateCV } from "@/utils/pdfGenerator";
import { VCardBio } from "./VCardBio";
import { VCardEducation } from "./VCardEducation";
import { VCardExperiences } from "./VCardExperiences";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface VCardProps {
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
}

export function VCard({ onEditStateChange, onRequestChat }: VCardProps) {
  const { profile, setProfile, isLoading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [sectionsOrder, setSectionsOrder] = useState<string[]>([]);

  useEffect(() => {
    if (profile?.sections_order) {
      setSectionsOrder(profile.sections_order);
    } else {
      setSectionsOrder(['header', 'bio', 'contact', 'skills', 'education', 'experience']);
    }
  }, [profile]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (onEditStateChange) {
      onEditStateChange(!isEditing);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      await updateProfile({
        ...profile,
        sections_order: sectionsOrder
      });
      setIsEditing(false);
      if (onEditStateChange) {
        onEditStateChange(false);
      }
      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Erreur lors de la sauvegarde du profil");
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sectionsOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSectionsOrder(items);
  };

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'header':
        return (
          <VCardHeader
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        );
      case 'bio':
        return (
          <VCardBio
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        );
      case 'contact':
        return (
          <VCardContact
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        );
      case 'skills':
        return (
          <VCardContent
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            handleAddSkill={() => {
              if (!profile || !newSkill.trim()) return;
              const updatedSkills = [...(profile.skills || []), newSkill.trim()];
              setProfile({ ...profile, skills: updatedSkills });
              setNewSkill("");
            }}
            handleRemoveSkill={(skillToRemove: string) => {
              if (!profile) return;
              const updatedSkills = (profile.skills || []).filter(
                (skill) => skill !== skillToRemove
              );
              setProfile({ ...profile, skills: updatedSkills });
            }}
          />
        );
      case 'education':
        return (
          <VCardEducation
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        );
      case 'experience':
        return (
          <VCardExperiences
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <VCardSkeleton />;
  }

  if (!profile) {
    return <VCardEmpty />;
  }

  return (
    <VCardContainer 
      isEditing={isEditing} 
      customStyles={{
        font: profile.custom_font,
        background: profile.custom_background,
        textColor: profile.custom_text_color
      }}
    >
      <div className="space-y-8">
        {isEditing && (
          <div className="space-y-4 p-4 bg-background/50 rounded-lg border">
            <h3 className="text-lg font-semibold">Personnalisation</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="custom-font">Police personnalisée</Label>
                <Input
                  id="custom-font"
                  value={profile.custom_font || ''}
                  onChange={(e) => setProfile({ ...profile, custom_font: e.target.value })}
                  placeholder="Nom de la police (ex: 'Roboto, sans-serif')"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-background">Couleur de fond</Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-background"
                    value={profile.custom_background || ''}
                    onChange={(e) => setProfile({ ...profile, custom_background: e.target.value })}
                    placeholder="Code couleur (ex: #ffffff)"
                  />
                  <input
                    type="color"
                    value={profile.custom_background || '#ffffff'}
                    onChange={(e) => setProfile({ ...profile, custom_background: e.target.value })}
                    className="w-10 h-10 rounded"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-text-color">Couleur du texte</Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-text-color"
                    value={profile.custom_text_color || ''}
                    onChange={(e) => setProfile({ ...profile, custom_text_color: e.target.value })}
                    placeholder="Code couleur (ex: #000000)"
                  />
                  <input
                    type="color"
                    value={profile.custom_text_color || '#000000'}
                    onChange={(e) => setProfile({ ...profile, custom_text_color: e.target.value })}
                    className="w-10 h-10 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-8"
              >
                {sectionsOrder.map((sectionId, index) => (
                  <Draggable
                    key={sectionId}
                    draggableId={sectionId}
                    index={index}
                    isDragDisabled={!isEditing}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${isEditing ? 'hover:bg-accent/50 rounded-lg transition-colors' : ''}`}
                      >
                        {renderSection(sectionId)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <VCardFooter
          isEditing={isEditing}
          isPdfGenerating={isPdfGenerating}
          profile={profile}
          onEditToggle={handleEditToggle}
          onSave={handleSave}
          onDownloadBusinessCard={async () => {
            if (!profile) return;
            setIsPdfGenerating(true);
            try {
              const doc = await generateBusinessCard(profile);
              doc.save(`carte-visite-${profile.full_name?.toLowerCase().replace(/\s+/g, '_') || 'professionnel'}.pdf`);
              toast.success("Business PDF généré avec succès");
            } catch (error) {
              console.error('Error generating business PDF:', error);
              toast.error("Erreur lors de la génération du Business PDF");
            } finally {
              setIsPdfGenerating(false);
            }
          }}
          onDownloadCV={async () => {
            if (!profile) return;
            setIsPdfGenerating(true);
            try {
              const doc = await generateCV(profile);
              doc.save(`cv-${profile.full_name?.toLowerCase().replace(/\s+/g, '_') || 'cv'}.pdf`);
              toast.success("CV PDF généré avec succès");
            } catch (error) {
              console.error('Error generating CV PDF:', error);
              toast.error("Erreur lors de la génération du CV PDF");
            } finally {
              setIsPdfGenerating(false);
            }
          }}
        />
      </div>
    </VCardContainer>
  );
}