import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { VCardHeader } from "./VCardHeader";
import { VCardContact } from "./VCardContact";
import { VCardSkills } from "./VCardSkills";
import { VCardCertifications } from "./VCardCertifications";
import { VCardActions } from "./VCardActions";
import { useProfile } from "@/hooks/useProfile";
import { generateVCardData, updateProfile } from "@/utils/profileActions";
import { motion } from "framer-motion";

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
          title: profile.name,
          text: `Professional profile of ${profile.name}`,
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
    link.setAttribute("download", `${profile.name.replace(" ", "_")}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Succès",
      description: "VCard téléchargée avec succès",
    });
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
    return (
      <Card className="w-full max-w-2xl mx-auto glass-card animate-pulse">
        <CardContent className="p-6">
          <div className="h-24 bg-muted rounded-lg mb-6"></div>
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile || !tempProfile) {
    return (
      <Card className="w-full max-w-2xl mx-auto glass-card">
        <CardContent className="p-6 text-center text-muted-foreground">
          Aucune donnée de profil disponible
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto glass-card backdrop-blur-sm">
        <CardContent className="p-6 space-y-8">
          <VCardHeader
            profile={tempProfile}
            isEditing={isEditing}
            setProfile={setTempProfile}
            setIsEditing={setIsEditing}
          />

          <div className="grid gap-8">
            <VCardContact
              profile={tempProfile}
              isEditing={isEditing}
              setProfile={setTempProfile}
            />

            <VCardSkills
              profile={tempProfile}
              isEditing={isEditing}
              setProfile={setTempProfile}
              newSkill={newSkill}
              setNewSkill={setNewSkill}
              handleAddSkill={() => {
                if (newSkill && !tempProfile.skills.includes(newSkill)) {
                  setTempProfile({
                    ...tempProfile,
                    skills: [...tempProfile.skills, newSkill],
                  });
                  setNewSkill("");
                }
              }}
              handleRemoveSkill={(skillToRemove: string) => {
                setTempProfile({
                  ...tempProfile,
                  skills: tempProfile.skills.filter((skill) => skill !== skillToRemove),
                });
              }}
            />

            <VCardCertifications
              profile={tempProfile}
              isEditing={isEditing}
              setProfile={setTempProfile}
            />
          </div>

          <VCardActions
            isEditing={isEditing}
            onShare={handleShare}
            onDownload={handleDownloadVCard}
            onCopyLink={handleCopyLink}
            onSave={handleSave}
            onApplyChanges={handleApplyChanges}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}