import { UserProfile } from "@/types/profile";
import { VCardInfo } from "./VCardInfo";
import { VCardAvatar } from "./VCardAvatar";
import { VCardActions } from "@/components/VCardActions";
import { useState } from "react";
import { toast } from "sonner";
import { useVCardStyle } from "../../VCardStyleContext";
import { VCardQRCode } from "../../VCardQRCode";
import { generateCV } from "@/utils/pdf/cv";
import jsPDF from "jspdf";

interface VCardHeaderProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  onEditToggle?: () => void;
  onSave?: () => void;
  onDownloadBusinessCard?: () => Promise<void>;
}

export function VCardHeader({ 
  profile,
  isEditing,
  setProfile,
  onEditToggle,
  onSave,
  onDownloadBusinessCard
}: VCardHeaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const { selectedStyle } = useVCardStyle();

  const handleInputChange = (key: string, value: string) => {
    setProfile({ ...profile, [key]: value });
  };

  const handleDownloadCV = async () => {
    setIsPdfGenerating(true);
    try {
      const doc = new jsPDF();
      await generateCV(doc, profile, selectedStyle);
      doc.save(`cv-${profile.full_name?.toLowerCase().replace(/\s+/g, '_') || 'professionnel'}.pdf`);
      toast.success("CV téléchargé avec succès");
    } catch (error) {
      console.error('Error generating CV:', error);
      toast.error("Erreur lors de la génération du CV");
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (onDownloadBusinessCard) {
      setIsPdfGenerating(true);
      try {
        await onDownloadBusinessCard();
        toast.success("Carte de visite téléchargée");
      } catch (error) {
        toast.error("Échec du téléchargement");
      } finally {
        setIsPdfGenerating(false);
      }
    }
  };

  return (
    <div className="space-y-6 relative">
      <VCardQRCode />
      
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <VCardInfo
            profile={profile}
            isEditing={isEditing}
            handleInputChange={handleInputChange}
          />
        </div>
        
        <div className="flex gap-2">
          <VCardActions
            isEditing={isEditing}
            isProcessing={isProcessing}
            isPdfGenerating={isPdfGenerating}
            setIsEditing={onEditToggle}
            onSave={onSave}
            onDownloadBusinessCard={handleDownload}
            onDownloadCV={handleDownloadCV}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <VCardAvatar 
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />
      </div>
    </div>
  );
}