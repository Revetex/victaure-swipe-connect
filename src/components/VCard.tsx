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

interface VCardProps {
  onEditStateChange?: (isEditing: boolean) => void;
}

interface StyleOption {
  id: number;
  name: string;
  color: string;
  font: string;
  displayStyle: string;
}

const styleOptions: StyleOption[] = [
  {
    id: 1,
    name: "Classique",
    color: "#1E40AF",
    font: "poppins",
    displayStyle: "default"
  },
  {
    id: 2,
    name: "Chaleureux",
    color: "#F59E0B",
    font: "montserrat",
    displayStyle: "warm"
  },
  {
    id: 3,
    name: "Moderne",
    color: "#10B981",
    font: "roboto",
    displayStyle: "modern"
  },
  {
    id: 4,
    name: "Élégant",
    color: "#3B82F6",
    font: "playfair",
    displayStyle: "elegant"
  },
  {
    id: 5,
    name: "Audacieux",
    color: "#6D28D9",
    font: "opensans",
    displayStyle: "bold"
  }
];

export function VCardComponent({ onEditStateChange }: VCardProps) {
  const { profile, setProfile, isLoading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(styleOptions[0]);

  useEffect(() => {
    // Charger les polices
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
      await generateVCardPDF(profile, selectedStyle.color);
      toast.success("PDF téléchargé avec succès");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  const handleStyleSelect = (style: StyleOption) => {
    setSelectedStyle(style);
    document.documentElement.style.setProperty('--accent-color', style.color);
    // Appliquer la police à l'élément racine du VCard
    const vCardElement = document.querySelector('.vcard-root');
    if (vCardElement) {
      vCardElement.className = `vcard-root font-${style.font} style-${style.displayStyle}`;
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
      className={`vcard-root w-full max-w-4xl mx-auto font-${selectedStyle.font}`}
      style={{ '--accent-color': selectedStyle.color } as React.CSSProperties}
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

          {isEditing && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {styleOptions.map((style) => (
                <Button
                  key={style.id}
                  onClick={() => handleStyleSelect(style)}
                  className={`p-4 rounded-lg transition-all duration-300 ${
                    selectedStyle.id === style.id 
                    ? 'ring-2 ring-white' 
                    : 'hover:ring-2 hover:ring-white/50'
                  }`}
                  style={{ backgroundColor: style.color }}
                >
                  <span className="text-white text-sm font-medium">
                    {style.name}
                  </span>
                </Button>
              ))}
            </div>
          )}

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
                style={{ backgroundColor: selectedStyle.color }}
                className="text-white transition-colors"
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
