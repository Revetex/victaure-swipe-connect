import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { VCardHeader } from "./VCardHeader";
import { VCardContact } from "./VCardContact";
import { VCardSkills } from "./VCardSkills";
import { VCardCertifications } from "./VCardCertifications";
import { mockProfile } from "@/data/mockProfile";
import type { UserProfile } from "@/data/mockProfile";

export function VCard() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [newSkill, setNewSkill] = useState("");

  const generateVCardData = () => {
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

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  };

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