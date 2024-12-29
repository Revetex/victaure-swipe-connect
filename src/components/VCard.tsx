import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { generateVCardData, updateProfile } from "@/utils/profileActions";
import { generateVCardPDF } from "@/utils/pdfGenerator";
import { VCardSkeleton } from "./vcard/VCardSkeleton";
import { VCardEmpty } from "./vcard/VCardEmpty";
import { VCardContent } from "./vcard/VCardContent";
import type { UserProfile } from "@/types/profile";

export function VCard() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const { profile, setProfile, tempProfile, setTempProfile, isLoading } = useProfile();

  const handleShare = async () => {
    if (!profile) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.full_name || '',
          text: `Professional profile of ${profile.full_name || ''}`,
          url: window.location.href,
        });
        toast({
          title: "Succès",
          description: "Profil partagé avec succès",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de partager le profil",
        });
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadVCard = () => {
    if (!profile) return;
    
    const vCardData = generateVCardData(profile);
    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${profile.full_name?.replace(" ", "_") || 'profile'}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Succès",
      description: "VCard téléchargée avec succès",
    });
  };

  const handleDownloadPDF = async () => {
    if (!profile) return;
    
    try {
      const pdfUrl = await generateVCardPDF(profile);
      window.open(pdfUrl, '_blank');
      
      toast({
        title: "Succès",
        description: "PDF généré avec succès",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le PDF",
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Succès",
      description: "Lien copié dans le presse-papier",
    });
  };

  const handleSave = async () => {
    if (!tempProfile) return;

    try {
      await updateProfile(tempProfile);
      setProfile(tempProfile);
      setIsEditing(false);
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
      });
    }
  };

  const handleApplyChanges = async () => {
    if (!tempProfile) return;
    
    try {
      await updateProfile(tempProfile);
      setProfile(tempProfile);
      setIsEditing(false);
      toast({
        title: "Succès",
        description: "Changements appliqués avec succès",
      });
    } catch (error) {
      console.error('Error applying changes:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'appliquer les changements",
      });
    }
  };

  if (isLoading) {
    return <VCardSkeleton />;
  }

  if (!profile || !tempProfile) {
    return <VCardEmpty />;
  }

  return (
    <div className="space-y-4">
      <VCardContent
        profile={profile}
        tempProfile={tempProfile}
        isEditing={isEditing}
        setProfile={setProfile}
        setTempProfile={setTempProfile}
        setIsEditing={setIsEditing}
        newSkill={newSkill}
        setNewSkill={setNewSkill}
        onShare={handleShare}
        onDownload={handleDownloadVCard}
        onDownloadPDF={handleDownloadPDF}
        onCopyLink={handleCopyLink}
        onSave={handleSave}
        onApplyChanges={handleApplyChanges}
      />
    </div>
  );
}