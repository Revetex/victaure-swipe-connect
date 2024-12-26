import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";
import { Share2, Download, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  
  const generateVCardData = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${mockProfile.name}
TITLE:${mockProfile.title}
TEL:${mockProfile.phone}
EMAIL:${mockProfile.email}
NOTE:Skills: ${mockProfile.skills.join(", ")}
END:VCARD`;
    return vcard;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: mockProfile.name,
          text: `Profile professionnel de ${mockProfile.name}`,
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
    link.setAttribute("download", `${mockProfile.name.replace(" ", "_")}.vcf`);
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{mockProfile.name}</CardTitle>
        <p className="text-victaure-gray-dark">{mockProfile.title}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-victaure-gray-dark">Email</p>
              <p>{mockProfile.email}</p>
            </div>
            <div>
              <p className="text-sm text-victaure-gray-dark">Téléphone</p>
              <p>{mockProfile.phone}</p>
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
            {mockProfile.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Expériences</h3>
          <div className="space-y-3">
            {mockProfile.experiences.map((exp, index) => (
              <div key={index} className="border-l-2 border-victaure-blue pl-4">
                <p className="font-medium">{exp.position}</p>
                <p className="text-sm text-victaure-gray-dark">{exp.company}</p>
                <p className="text-sm text-victaure-gray-dark">{exp.duration}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
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
        </div>
      </CardContent>
    </Card>
  );
}