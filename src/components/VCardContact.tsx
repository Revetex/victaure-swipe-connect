import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { VCardSection } from "./VCardSection";
import { generateVCardPDF } from "@/utils/pdfGenerator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { quebecCities } from "@/data/cities";

interface VCardContactProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(true);
  
  const provinces = [
    "Alberta",
    "Colombie-Britannique",
    "Manitoba",
    "Nouveau-Brunswick",
    "Terre-Neuve-et-Labrador",
    "Nouvelle-Écosse",
    "Ontario",
    "Île-du-Prince-Édouard",
    "Québec",
    "Saskatchewan",
  ];

  useEffect(() => {
    const generatePDF = async () => {
      try {
        setIsGenerating(true);
        const url = await generateVCardPDF(profile);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        setIsGenerating(false);
      }
    };

    generatePDF();
  }, [profile]);

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-6">
      <div className="space-y-4 flex-1 w-full">
        <VCardSection 
          title="Contact" 
          icon={<Mail className="h-4 w-4 text-muted-foreground" />}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-2 sm:mt-0" />
            {isEditing ? (
              <Input
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="flex-1"
                placeholder="Votre email"
              />
            ) : (
              <span className="text-sm">{profile.email || "Email non défini"}</span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0 mt-2 sm:mt-0" />
            {isEditing ? (
              <Input
                value={profile.phone || ""}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="flex-1"
                placeholder="Votre téléphone"
                type="tel"
              />
            ) : (
              <span className="text-sm">{profile.phone || "Téléphone non défini"}</span>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-2 sm:mt-0" />
              {isEditing ? (
                <Select
                  value={profile.city || ""}
                  onValueChange={(value) => setProfile({ ...profile, city: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {quebecCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className="text-sm">{profile.city || "Ville non définie"}</span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground shrink-0 mt-2 sm:mt-0" />
              {isEditing ? (
                <Select
                  value={profile.state || ""}
                  onValueChange={(value) => setProfile({ ...profile, state: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez une province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className="text-sm">{profile.state || "Province non définie"}</span>
              )}
            </div>
          </div>
        </VCardSection>
      </div>
      <div className="bg-card p-4 rounded-lg shadow-sm border w-full sm:w-auto flex flex-col items-center gap-2">
        <span className="text-sm text-muted-foreground mb-2">Scanner pour télécharger</span>
        {isGenerating ? (
          <div className="w-[160px] h-[160px] mx-auto animate-pulse bg-muted rounded-lg" />
        ) : (
          <QRCodeSVG
            value={pdfUrl}
            size={160}
            level="H"
            includeMargin={true}
            className="mx-auto bg-white p-2 rounded-lg"
          />
        )}
      </div>
    </div>
  );
}