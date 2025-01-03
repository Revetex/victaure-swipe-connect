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
  onRequestChat?: () => void;
}

interface StyleOption {
  id: number;
  name: string;
  color: string;
  font: string;
  displayStyle: string;
  bgGradient: string;
  secondaryColor: string;
  accentGradient: string;
  borderStyle?: string;
}

const styleOptions: StyleOption[] = [
  {
    id: 1,
    name: "Classique",
    color: "#1E40AF",
    font: "poppins",
    displayStyle: "default",
    bgGradient: "from-blue-600 to-blue-800",
    secondaryColor: "#60A5FA",
    accentGradient: "from-blue-400/20 to-blue-600/20"
  },
  {
    id: 2,
    name: "Chaleureux",
    color: "#F59E0B",
    font: "montserrat",
    displayStyle: "warm",
    bgGradient: "from-amber-500 to-orange-600",
    secondaryColor: "#FCD34D",
    accentGradient: "from-amber-400/20 to-orange-500/20"
  },
  {
    id: 3,
    name: "Moderne",
    color: "#10B981",
    font: "roboto",
    displayStyle: "modern",
    bgGradient: "from-emerald-500 to-teal-600",
    secondaryColor: "#34D399",
    accentGradient: "from-emerald-400/20 to-teal-500/20",
    borderStyle: "border-l-4"
  },
  {
    id: 4,
    name: "Élégant",
    color: "#8B5CF6",
    font: "playfair",
    displayStyle: "elegant",
    bgGradient: "from-violet-600 via-purple-600 to-indigo-700",
    secondaryColor: "#A78BFA",
    accentGradient: "from-violet-400/20 to-purple-500/20",
    borderStyle: "rounded-xl"
  },
  {
    id: 5,
    name: "Audacieux",
    color: "#EC4899",
    font: "opensans",
    displayStyle: "bold",
    bgGradient: "from-pink-600 via-rose-600 to-red-600",
    secondaryColor: "#F472B6",
    accentGradient: "from-pink-400/20 to-rose-500/20"
  },
  {
    id: 6,
    name: "Minimaliste",
    color: "#6B7280",
    font: "inter",
    displayStyle: "minimal",
    bgGradient: "from-gray-700 to-gray-800",
    secondaryColor: "#9CA3AF",
    accentGradient: "from-gray-400/20 to-gray-500/20",
    borderStyle: "border-t-2"
  },
  {
    id: 7,
    name: "Créatif",
    color: "#F97316",
    font: "quicksand",
    displayStyle: "creative",
    bgGradient: "from-orange-500 via-amber-500 to-yellow-500",
    secondaryColor: "#FB923C",
    accentGradient: "from-orange-400/20 to-amber-500/20",
    borderStyle: "rounded-full"
  },
  {
    id: 8,
    name: "Professionnel",
    color: "#0284C7",
    font: "lato",
    displayStyle: "professional",
    bgGradient: "from-sky-600 via-blue-600 to-indigo-600",
    secondaryColor: "#38BDF8",
    accentGradient: "from-sky-400/20 to-blue-500/20",
    borderStyle: "border-b-2"
  }
];

export function VCardComponent({ onEditStateChange, onRequestChat }: VCardProps) {
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
    document.documentElement.style.setProperty('--secondary-color', style.secondaryColor);
    
    const vCardElement = document.querySelector('.vcard-root');
    if (vCardElement) {
      vCardElement.className = `vcard-root font-${style.font} style-${style.displayStyle} ${style.borderStyle || ''}`;
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
      style={{ 
        '--accent-color': selectedStyle.color,
        '--secondary-color': selectedStyle.secondaryColor 
      } as React.CSSProperties}
    >
      <Card className={`border-none shadow-lg bg-gradient-to-br ${selectedStyle.bgGradient} ${selectedStyle.borderStyle || ''}`}>
        <CardContent className="p-6 space-y-8">
          {isEditing && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {styleOptions.map((style) => (
                <Button
                  key={style.id}
                  onClick={() => handleStyleSelect(style)}
                  className={`p-4 rounded-lg transition-all duration-300 relative overflow-hidden group ${
                    selectedStyle.id === style.id 
                    ? 'ring-2 ring-white scale-105' 
                    : 'hover:ring-2 hover:ring-white/50 hover:scale-105'
                  }`}
                  style={{ 
                    background: `linear-gradient(135deg, ${style.color}, ${style.secondaryColor})` 
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                       style={{ 
                         background: `linear-gradient(135deg, ${style.accentGradient})` 
                       }} 
                  />
                  <span className="relative z-10 text-white text-sm font-medium">
                    {style.name}
                  </span>
                </Button>
              ))}
            </div>
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
