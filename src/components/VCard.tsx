import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { VCardHeader } from "./VCardHeader";
import { VCardContact } from "./VCardContact";
import { VCardSkills } from "./VCardSkills";
import { VCardCertifications } from "./VCardCertifications";
import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/data/mockProfile";

export function VCard() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

        // Transform the profile data to match the UserProfile type
        const transformedProfile: UserProfile = {
          name: profileData.full_name || '',
          title: profileData.role || '',
          email: profileData.email || '',
          phone: '', // Add phone field to profiles table if needed
          skills: profileData.skills || [],
          experiences: [], // Add experiences field to profiles table if needed
          certifications: [], // Add certifications field to profiles table if needed
        };

        setProfile(transformedProfile);
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
    if (!profile) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.name,
          role: profile.title,
          skills: profile.skills,
        })
        .eq('id', user.id);

      if (error) throw error;

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

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto glass-card">
        <CardContent className="p-6">
          Loading profile...
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
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
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
          setIsEditing={setIsEditing}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <VCardContact
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />

          <VCardSkills
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            handleAddSkill={() => {
              if (newSkill && !profile.skills.includes(newSkill)) {
                setProfile({
                  ...profile,
                  skills: [...profile.skills, newSkill],
                });
                setNewSkill("");
              }
            }}
            handleRemoveSkill={(skillToRemove: string) => {
              setProfile({
                ...profile,
                skills: profile.skills.filter((skill) => skill !== skillToRemove),
              });
            }}
          />
        </div>

        <VCardCertifications
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />

        <div className="flex gap-3 pt-4 border-t">
          {isEditing ? (
            <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          ) : (
            <>
              <Button onClick={handleShare} className="flex-1">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button onClick={handleDownloadVCard} variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download VCard
              </Button>
              <Button onClick={handleCopyLink} variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}