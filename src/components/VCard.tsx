import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { VCardSkeleton } from "./vcard/VCardSkeleton";
import { VCardEmpty } from "./vcard/VCardEmpty";
import { Card, CardContent } from "@/components/ui/card";
import { VCardHeader } from "./VCardHeader";
import { VCardContact } from "./VCardContact";
import { VCardSkills } from "./VCardSkills";
import { VCardCertifications } from "./VCardCertifications";
import { VCardEducation } from "./VCardEducation";
import { VCardExperiences } from "./VCardExperiences";
import { Button } from "./ui/button";
import { Download, Edit2, Save } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { generateVCardPDF } from "@/utils/pdfGenerator";
import { VCardStyleSelector } from "./vcard/VCardStyleSelector";
import { styleOptions } from "./vcard/styles";
import { StyleOption } from "./vcard/types";

interface VCardProps {
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
}

export function VCardComponent({ onEditStateChange, onRequestChat }: VCardProps) {
  const { profile, setProfile, isLoading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(styleOptions[0]);

  useEffect(() => {
    const loadFonts = async () => {
      await Promise.all([
        document.fonts.load("1em Poppins"),
        document.fonts.load("1em Montserrat"),
        document.fonts.load("1em Playfair Display"),
        document.fonts.load("1em Roboto"),
        document.fonts.load("1em Open Sans"),
      ]);
    };
    loadFonts();
  }, []);

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
      await generateVCardPDF(profile, selectedStyle.colorScheme.primary);
      toast.success("PDF téléchargé avec succès");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  const handleStyleSelect = (style: StyleOption) => {
    setSelectedStyle(style);
    document.documentElement.style.setProperty('--accent-color', style.colorScheme.primary);
    document.documentElement.style.setProperty('--secondary-color', style.colorScheme.secondary);
    
    const vCardElement = document.querySelector('.vcard-root');
    if (vCardElement) {
      vCardElement.className = `vcard-root font-${style.fontFamily} ${style.layout}`;
    }
  };

  const handleAddSkill = () => {
    if (newSkill && profile?.skills) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (profile?.skills) {
      setProfile({
        ...profile,
        skills: profile.skills.filter(skill => skill !== skillToRemove),
      });
    }
  };

  if (isLoading) {
    return <VCardSkeleton />;
  }

  if (!profile) {
    return <VCardEmpty />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`vcard-root w-full max-w-4xl mx-auto font-${selectedStyle.fontFamily}`}
      style={{ 
        '--accent-color': selectedStyle.colorScheme.primary,
        '--secondary-color': selectedStyle.colorScheme.secondary 
      } as React.CSSProperties}
    >
      <Card className={`border-none shadow-lg ${selectedStyle.colorScheme.primary}`}>
        <CardContent className="p-6 space-y-8">
          {isEditing && (
            <VCardStyleSelector
              selectedStyle={selectedStyle}
              onStyleSelect={handleStyleSelect}
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

          <motion.div className="space-y-8 pt-6">
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

            <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-white/20">
              {isEditing ? (
                <Button
                  onClick={handleSave}
                  className={`text-white transition-colors ${selectedStyle.colorScheme.primary}`}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              ) : (
                <Button
                  onClick={handleEditToggle}
                  className={`text-white transition-colors ${selectedStyle.colorScheme.primary}`}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Modifier mon profil
                </Button>
              )}

              <Button
                onClick={handleDownloadPDF}
                className={`text-white transition-colors ${selectedStyle.colorScheme.primary}`}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger PDF
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export { VCardComponent as VCard };