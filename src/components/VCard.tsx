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
import { generateVCardPDF } from "@/utils/pdfGenerator";
import { VCardStyleSelectorMinimal } from "./vcard/VCardStyleSelectorMinimal";
import { styleOptions } from "./vcard/styles";
import { StyleOption } from "./vcard/types";

interface VCardProps {
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
}

export function VCard({ onEditStateChange, onRequestChat }: VCardProps) {
  const { profile, setProfile, isLoading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(styleOptions[0]);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Promise.all([
          document.fonts.load("1em Poppins"),
          document.fonts.load("1em Montserrat"),
          document.fonts.load("1em Playfair Display"),
          document.fonts.load("1em Roboto"),
          document.fonts.load("1em Open Sans"),
          document.fonts.load("1em Inter"),
          document.fonts.load("1em Quicksand"),
          document.fonts.load("1em Lato"),
        ]);
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
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

  const handleAddSkill = () => {
    if (!profile || !newSkill.trim()) return;
    
    const updatedSkills = [...(profile.skills || []), newSkill.trim()];
    setProfile({ ...profile, skills: updatedSkills });
    setNewSkill("");
    toast.success("Compétence ajoutée avec succès");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!profile) return;
    
    const updatedSkills = (profile.skills || []).filter(
      (skill) => skill !== skillToRemove
    );
    setProfile({ ...profile, skills: updatedSkills });
    toast.success("Compétence supprimée avec succès");
  };

  const handleDownloadPDF = async () => {
    if (!profile) {
      toast.error("Aucun profil trouvé");
      return;
    }

    try {
      setIsPdfGenerating(true);
      toast.loading("Génération du PDF en cours...");
      
      await generateVCardPDF(profile, selectedStyle.color);
      
      toast.dismiss();
      toast.success("PDF téléchargé avec succès");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.dismiss();
      toast.error("Erreur lors de la génération du PDF. Veuillez réessayer.");
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleStyleSelect = (style: StyleOption) => {
    setSelectedStyle(style);
    document.documentElement.style.setProperty('--accent-color', style.color);
    document.documentElement.style.setProperty('--secondary-color', style.secondaryColor);
    
    const vCardElement = document.querySelector('.vcard-root');
    if (vCardElement) {
      vCardElement.className = `vcard-root font-${style.font} style-${style.displayStyle} ${style.borderStyle || ''}`;
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
      className={`vcard-root w-full max-w-4xl mx-auto font-${selectedStyle.font}`}
      style={{ 
        '--accent-color': selectedStyle.color,
        '--secondary-color': selectedStyle.secondaryColor 
      } as React.CSSProperties}
    >
      <Card className={`border-none shadow-lg bg-gradient-to-br ${selectedStyle.bgGradient} ${selectedStyle.borderStyle || ''}`}>
        <CardContent className="p-6 space-y-8">
          {isEditing && (
            <VCardStyleSelectorMinimal
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
                  style={{ backgroundColor: selectedStyle.color }}
                  className="text-white transition-colors"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              ) : (
                <Button
                  onClick={handleEditToggle}
                  style={{ backgroundColor: selectedStyle.color }}
                  className="text-white transition-colors"
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Modifier mon profil
                </Button>
              )}

              <Button
                onClick={handleDownloadPDF}
                disabled={isPdfGenerating}
                style={{ backgroundColor: selectedStyle.color }}
                className="text-white transition-colors disabled:opacity-50"
              >
                <Download className="mr-2 h-4 w-4" />
                {isPdfGenerating ? 'Génération...' : 'Télécharger PDF'}
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}