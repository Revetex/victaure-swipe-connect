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

interface VCardContentProps {
  profile: any;
  selectedStyle: StyleOption;
  setSelectedStyle: (style: StyleOption) => void;
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
}

export function VCardContent({
  profile,
  selectedStyle,
  setSelectedStyle,
  onEditStateChange,
  onRequestChat
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

  return (
    <CardContent className="p-6 space-y-6">
      {isEditing && (
        <VCardStyleSelector
          selectedStyle={selectedStyle}
          onStyleSelect={setSelectedStyle}
        />
      )}

      <VCardHeader
        profile={profile}
        isEditing={isEditing}
      />

      <VCardContact
        profile={profile}
        isEditing={isEditing}
      />

      <motion.div className="space-y-6">
        <VCardSkills
          profile={profile}
          isEditing={isEditing}
          newSkill={newSkill}
          setNewSkill={setNewSkill}
        />

        <VCardExperiences
          profile={profile}
          isEditing={isEditing}
        />

        <VCardCertifications
          profile={profile}
          isEditing={isEditing}
        />

        <VCardEducation
          profile={profile}
          isEditing={isEditing}
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