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
import { VCardStyleContext } from "./vcard/VCardStyleContext";
import { updateProfile } from "@/utils/profileActions";

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
    if (!profile) return;

    try {
      // Update profile including all related data
      await updateProfile(profile);

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

  const handleStyleSelect = async (style: StyleOption) => {
    setSelectedStyle(style);
    if (!isEditing) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ style_id: style.id })
          .eq('id', profile?.id);

        if (error) throw error;

        if (profile) {
          setProfile({
            ...profile,
            style_id: style.id
          });
        }

        toast.success("Style mis à jour avec succès");
      } catch (error) {
        console.error('Error updating style:', error);
        toast.error("Erreur lors de la mise à jour du style");
      }
    }
  };

  if (isLoading) {
    return <VCardSkeleton />;
  }

  if (!profile) {
    return <VCardEmpty />;
  }

  return (
    <VCardStyleContext.Provider value={{ selectedStyle, isEditing }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`vcard-root w-full max-w-4xl mx-auto ${
          isEditing ? 'fixed inset-0 z-50 overflow-y-auto pb-20' : 'relative'
        }`}
        style={{
          '--accent-color': selectedStyle.color,
          '--secondary-color': selectedStyle.secondaryColor,
          '--font-family': selectedStyle.font,
        } as React.CSSProperties}
      >
        {isEditing && (
          <div className="fixed inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-sm" />
        )}
        
        <Card 
          className={`relative border-none shadow-lg ${
            isEditing 
              ? 'bg-white/10 backdrop-blur-md dark:bg-gray-900/30' 
              : selectedStyle.bgGradient
          } ${selectedStyle.borderStyle}`}
          style={{
            fontFamily: selectedStyle.font,
            color: selectedStyle.colors.text.primary,
          }}
        >
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

              <div className="flex justify-between items-center">
                <VCardActions
                  isEditing={isEditing}
                  isPdfGenerating={isPdfGenerating}
                  profile={profile}
                  selectedStyle={selectedStyle}
                  onEditToggle={handleEditToggle}
                  onSave={handleSave}
                  onDownloadVCard={async () => {
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
                  }}
                  onDownloadBusinessCard={async () => {
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
    </VCardStyleContext.Provider>
  );
}