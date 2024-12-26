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
          title: "Success",
          description: "Profile shared successfully",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Unable to share profile",
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
      title: "Success",
      description: "VCard downloaded successfully",
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Success",
      description: "Link copied to clipboard",
    });
  };

  const handleSave = async () => {
    if (!tempProfile) return;

    try {
      await updateProfile(tempProfile);
      setProfile(tempProfile);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    }
  };

  const handleApplyChanges = async () => {
    if (!tempProfile) return;
    
    try {
      await updateProfile(tempProfile);
      setProfile(tempProfile);
      setIsEditing(false); // Close edit mode after successful update
      toast({
        title: "Success",
        description: "Changes applied successfully",
      });
    } catch (error) {
      console.error('Error applying changes:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to apply changes",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto glass-card">
        <CardContent className="p-6">
          Loading profile...
        </CardContent>
      </Card>
    );
  }

  if (!profile || !tempProfile) {
    return (
      <Card className="w-full max-w-2xl mx-auto glass-card">
        <CardContent className="p-6">
          No profile data available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto glass-card">
      <CardContent className="p-6 space-y-6">
        <VCardHeader
          profile={tempProfile}
          isEditing={isEditing}
          setProfile={setTempProfile}
          setIsEditing={setIsEditing}
        />

        <div className="grid gap-6 md:grid-cols-2">
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
        </div>

        <VCardCertifications
          profile={tempProfile}
          isEditing={isEditing}
          setProfile={setTempProfile}
        />

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
  );
}