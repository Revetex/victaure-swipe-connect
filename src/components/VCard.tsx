import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { VCardSkeleton } from "./vcard/VCardSkeleton";
import { VCardEmpty } from "./vcard/VCardEmpty";
import { Card, CardContent } from "@/components/ui/card";
import { VCardHeader } from "./VCardHeader";
import { VCardContact } from "./VCardContact";
import { toast } from "sonner";
import { styleOptions } from "./vcard/styles";
import { StyleOption } from "./vcard/types";
import { VCardStyleSelector } from "./vcard/VCardStyleSelector";
import { VCardActions } from "./vcard/VCardActions";
import { VCardContent } from "./vcard/VCardContent";
import { QRCodeSVG } from "qrcode.react";
import { generateVCard, generateBusinessCard, generateCV } from "@/utils/pdfGenerator";
import { supabase } from "@/integrations/supabase/client";

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

  // Load the saved style when profile loads
  useEffect(() => {
    if (profile?.style_id) {
      const savedStyle = styleOptions.find(style => style.id === profile.style_id);
      if (savedStyle) {
        setSelectedStyle(savedStyle);
      }
    }
  }, [profile]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (onEditStateChange) {
      onEditStateChange(!isEditing);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ style_id: selectedStyle.id })
        .eq('id', profile?.id);

      if (error) throw error;

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
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!profile) return;
    
    const updatedSkills = (profile.skills || []).filter(
      (skill) => skill !== skillToRemove
    );
    setProfile({ ...profile, skills: updatedSkills });
  };

  const handleStyleSelect = async (style: StyleOption) => {
    setSelectedStyle(style);
    if (!isEditing) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ style_id: style.id })
          .eq('id', profile?.id);

        if (error) throw error;
        toast.success("Style mis à jour avec succès");
      } catch (error) {
        console.error('Error updating style:', error);
        toast.error("Erreur lors de la mise à jour du style");
      }
    }
  };

  const handleDownloadVCard = async () => {
    if (!profile) return;
    setIsPdfGenerating(true);
    try {
      const doc = await generateVCard(profile);
      doc.save(`${profile.full_name?.toLowerCase().replace(/\s+/g, '_') || 'vcard'}.pdf`);
      toast.success("PDF généré avec succès");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleDownloadBusinessCard = async () => {
    if (!profile) return;
    setIsPdfGenerating(true);
    try {
      const doc = await generateBusinessCard(profile, selectedStyle);
      doc.save(`carte-visite-${profile.full_name?.toLowerCase().replace(/\s+/g, '_') || 'professionnel'}.pdf`);
      toast.success("Business PDF généré avec succès");
    } catch (error) {
      console.error('Error generating business PDF:', error);
      toast.error("Erreur lors de la génération du Business PDF");
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleDownloadCV = async () => {
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
        <CardContent className="p-6">
          <div className="space-y-8">
            <VCardStyleSelector
              selectedStyle={selectedStyle}
              onStyleSelect={handleStyleSelect}
              isEditing={isEditing}
            />

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

            <VCardContent
              profile={profile}
              isEditing={isEditing}
              selectedStyle={selectedStyle}
              setProfile={setProfile}
              newSkill={newSkill}
              setNewSkill={setNewSkill}
              handleAddSkill={handleAddSkill}
              handleRemoveSkill={handleRemoveSkill}
            />

            <div className="flex justify-between items-center">
              <VCardActions
                isEditing={isEditing}
                isPdfGenerating={isPdfGenerating}
                profile={profile}
                selectedStyle={selectedStyle}
                onEditToggle={handleEditToggle}
                onSave={handleSave}
                onDownloadVCard={handleDownloadVCard}
                onDownloadBusinessCard={handleDownloadBusinessCard}
                onDownloadCV={handleDownloadCV}
              />
              
              <div className="p-2 glass-card group hover:scale-105 transition-transform duration-300">
                <QRCodeSVG
                  value={window.location.href}
                  size={85}
                  level="H"
                  includeMargin={false}
                  className="rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
