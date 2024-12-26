import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";
import { Share2, Download, Copy, Edit2, Save, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

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
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold">
            {isEditing ? (
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="text-2xl font-bold"
              />
            ) : (
              profile.name
            )}
          </CardTitle>
          <p className="text-victaure-gray-dark">
            {isEditing ? (
              <Input
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              />
            ) : (
              profile.title
            )}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-victaure-gray-dark">Email</p>
              {isEditing ? (
                <Input
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              ) : (
                <p>{profile.email}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-victaure-gray-dark">Téléphone</p>
              {isEditing ? (
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              ) : (
                <p>{profile.phone}</p>
              )}
            </div>
          </div>
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <QRCodeSVG
              value={window.location.href}
              size={120}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Compétences</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                {skill}
                {isEditing && (
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveSkill(skill)}
                  />
                )}
              </Badge>
            ))}
          </div>
          {isEditing && (
            <div className="flex gap-2 mt-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Nouvelle compétence"
                onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
              />
              <Button onClick={handleAddSkill}>Ajouter</Button>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Expériences</h3>
          <div className="space-y-3">
            {profile.experiences.map((exp, index) => (
              <div key={index} className="border-l-2 border-victaure-blue pl-4">
                {isEditing ? (
                  <>
                    <Input
                      value={exp.position}
                      onChange={(e) => {
                        const newExperiences = [...profile.experiences];
                        newExperiences[index].position = e.target.value;
                        setProfile({ ...profile, experiences: newExperiences });
                      }}
                      className="mb-1"
                    />
                    <Input
                      value={exp.company}
                      onChange={(e) => {
                        const newExperiences = [...profile.experiences];
                        newExperiences[index].company = e.target.value;
                        setProfile({ ...profile, experiences: newExperiences });
                      }}
                      className="mb-1"
                    />
                    <Input
                      value={exp.duration}
                      onChange={(e) => {
                        const newExperiences = [...profile.experiences];
                        newExperiences[index].duration = e.target.value;
                        setProfile({ ...profile, experiences: newExperiences });
                      }}
                    />
                  </>
                ) : (
                  <>
                    <p className="font-medium">{exp.position}</p>
                    <p className="text-sm text-victaure-gray-dark">{exp.company}</p>
                    <p className="text-sm text-victaure-gray-dark">{exp.duration}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

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