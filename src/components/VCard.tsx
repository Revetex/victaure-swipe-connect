import { motion } from "framer-motion";
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { VCardSkeleton } from "./vcard/VCardSkeleton";
import { VCardEmpty } from "./vcard/VCardEmpty";
import { Card, CardContent } from "@/components/ui/card";
import { VCardHeader } from "./VCardHeader";
import { VCardContact } from "./VCardContact";
import { VCardSkills } from "./VCardSkills";
import { VCardCertifications } from "./VCardCertifications";
import { VCardEducation } from "./VCardEducation";
import { Button } from "./ui/button";
import { MessageSquare, Download, Edit2, Save } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { generateVCardPDF } from "@/utils/pdfGenerator";

interface VCardProps {
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
}

export function VCardComponent({ onEditStateChange, onRequestChat }: VCardProps) {
  const { profile, setProfile, isLoading } = useProfile();
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
      await generateVCardPDF(profile);
      toast.success("PDF téléchargé avec succès");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim() || !profile) return;
    const updatedSkills = [...(profile.skills || []), newSkill.trim()];
    setProfile({ ...profile, skills: updatedSkills });
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!profile) return;
    const updatedSkills = profile.skills?.filter(skill => skill !== skillToRemove) || [];
    setProfile({ ...profile, skills: updatedSkills });
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
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="border-none shadow-lg bg-victaure-metal">
        <CardContent className="p-6 space-y-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <VCardHeader
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
            />
            <div className="w-full sm:w-auto flex justify-center sm:block">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <QRCodeSVG
                  value={window.location.href}
                  size={100}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>
          </div>

          <VCardContact
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />

          <motion.div 
            className="space-y-8 pt-6"
          >
            <VCardSkills
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
              newSkill={newSkill}
              setNewSkill={setNewSkill}
              handleAddSkill={handleAddSkill}
              handleRemoveSkill={handleRemoveSkill}
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
                  className="bg-white hover:bg-white/90 text-victaure-metal transition-colors"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              ) : (
                <Button
                  onClick={handleEditToggle}
                  className="bg-white hover:bg-white/90 text-victaure-metal transition-colors"
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Modifier mon profil
                </Button>
              )}

              <Button
                onClick={handleDownloadPDF}
                className="bg-white hover:bg-white/90 text-victaure-metal transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger PDF
              </Button>

              <Button
                onClick={onRequestChat}
                className="bg-white hover:bg-white/90 text-victaure-metal transition-colors"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Discuter avec M. Victaure
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export { VCardComponent as VCard };