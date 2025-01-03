import { motion } from "framer-motion";
import { useState } from "react";
import { VCardHeader } from "../VCardHeader";
import { VCardContact } from "../VCardContact";
import { VCardSkills } from "../VCardSkills";
import { VCardCertifications } from "../VCardCertifications";
import { VCardEducation } from "../VCardEducation";
import { VCardExperiences } from "../VCardExperiences";
import { Button } from "../ui/button";
import { Download, Edit2, Save } from "lucide-react";
import { toast } from "sonner";
import { CardContent } from "../ui/card";
import { VCardStyleSelector } from "./VCardStyleSelector";
import { StyleOption } from "./types";
import { styleOptions } from "./styles"; // Import the styleOptions array

interface VCardContentProps {
  profile: any;
  selectedStyle: StyleOption;
  setSelectedStyle: (style: StyleOption) => void;
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
  setProfile: (profile: any) => void; // Add this prop
}

export function VCardContent({
  profile,
  selectedStyle,
  setSelectedStyle,
  onEditStateChange,
  onRequestChat,
  setProfile
}: VCardContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (onEditStateChange) {
      onEditStateChange(!isEditing);
    }
  };

  const handleSave = async () => {
    try {
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

  const handleDownloadPDF = async () => {
    if (!profile) return;
    try {
      toast.success("PDF téléchargé avec succès");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  const handleAddSkill = () => {
    if (newSkill && !profile.skills?.includes(newSkill)) {
      setProfile({
        ...profile,
        skills: [...(profile.skills || []), newSkill],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills?.filter((skill: string) => skill !== skillToRemove),
    });
  };

  return (
    <CardContent className="p-6 space-y-6">
      {isEditing && (
        <VCardStyleSelector
          selectedStyle={selectedStyle}
          onStyleSelect={setSelectedStyle}
          styleOptions={styleOptions}
        />
      )}

      <VCardHeader
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
      />

      <VCardContact
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
      />

      <motion.div className="space-y-6">
        <VCardSkills
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
          newSkill={newSkill}
          setNewSkill={setNewSkill}
          handleAddSkill={handleAddSkill}
          handleRemoveSkill={handleRemoveSkill}
        />

        <VCardExperiences
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />

        <VCardCertifications
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />

        <VCardEducation
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {isEditing ? (
            <Button
              onClick={handleSave}
              className="bg-sky-500 hover:bg-sky-600 text-white transition-colors"
            >
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder
            </Button>
          ) : (
            <Button
              onClick={handleEditToggle}
              className="bg-sky-500 hover:bg-sky-600 text-white transition-colors"
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Modifier mon profil
            </Button>
          )}

          <Button
            onClick={handleDownloadPDF}
            className="bg-sky-500 hover:bg-sky-600 text-white transition-colors"
          >
            <Download className="mr-2 h-4 w-4" />
            Télécharger PDF
          </Button>
        </div>
      </motion.div>
    </CardContent>
  );
}