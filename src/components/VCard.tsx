import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { VCardHeader } from "./VCardHeader";
import { VCardContact } from "./VCardContact";
import { VCardSkills } from "./VCardSkills";
import { VCardCertifications } from "./VCardCertifications";
import { VCardActions } from "./VCardActions";
import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/data/mockProfile";

export function VCard() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [tempProfile, setTempProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("No authenticated user");
        }

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        const transformedProfile: UserProfile = {
          name: profileData.full_name || '',
          title: profileData.role || '',
          email: profileData.email || '',
          phone: '',
          skills: profileData.skills || [],
          experiences: [],
          certifications: [],
        };

        setProfile(transformedProfile);
        setTempProfile(transformedProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [toast]);

  const generateVCardData = () => {
    if (!profile) return '';
    
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
TITLE:${profile.title}
TEL:${profile.phone}
EMAIL:${profile.email}
NOTE:Skills: ${profile.skills.join(", ")}
END:VCARD`;
    return vcard;
  };

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
    
    const vCardData = generateVCardData();
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: tempProfile.name,
          role: tempProfile.title,
          skills: tempProfile.skills,
        })
        .eq('id', user.id);

      if (error) throw error;

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: tempProfile.name,
          role: tempProfile.title,
          skills: tempProfile.skills,
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(tempProfile);
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