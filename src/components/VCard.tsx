import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { VCardHeader } from "./VCardHeader";
import { VCardContact } from "./VCardContact";
import { VCardSkills } from "./VCardSkills";
import { VCardCertifications } from "./VCardCertifications";

interface UserProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  skills: string[];
  experiences: {
    company: string;
    position: string;
    duration: string;
  }[];
  certifications: {
    title: string;
    institution: string;
    year: string;
  }[];
}

const mockProfile: UserProfile = {
  name: "Jean Dupont",
  title: "Développeur Full Stack Senior",
  email: "jean.dupont@example.com",
  phone: "+33 6 12 34 56 78",
  skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
  experiences: [
    {
      company: "Tech Solutions",
      position: "Lead Developer",
      duration: "2020 - Present",
    },
    {
      company: "Digital Agency",
      position: "Full Stack Developer",
      duration: "2018 - 2020",
    },
  ],
  certifications: [
    {
      title: "AWS Certified Solutions Architect",
      institution: "Amazon Web Services",
      year: "2023",
    },
    {
      title: "Master en Informatique",
      institution: "Université de Paris",
      year: "2018",
    },
  ],
};

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
          text: `Profile professionnel de ${profile.name}`,
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

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Succès",
      description: "Profil mis à jour avec succès",
    });
  };

  const handleAddSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <VCardHeader
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
          setIsEditing={setIsEditing}
        />
      </CardHeader>
      <CardContent className="space-y-6">
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
          handleAddSkill={handleAddSkill}
          handleRemoveSkill={handleRemoveSkill}
        />

        <VCardCertifications
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />

        <div className="flex gap-3 pt-4">
          {isEditing ? (
            <Button onClick={handleSave} className="flex-1">
              <Save className="mr-2" />
              Enregistrer
            </Button>
          ) : (
            <>
              <Button onClick={handleShare} className="flex-1">
                <Share2 className="mr-2" />
                Partager
              </Button>
              <Button onClick={handleDownloadVCard} variant="outline" className="flex-1">
                <Download className="mr-2" />
                Télécharger VCard
              </Button>
              <Button onClick={handleCopyLink} variant="outline">
                <Copy />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
