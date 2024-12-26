import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { VCardSection } from "./VCardSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VCardContactProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
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

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
      <div className="space-y-4 flex-1">
        <VCardSection title="Contact" className="space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
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
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
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
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              {isEditing ? (
                <Input
                  value={profile.city || ""}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="flex-1"
                  placeholder="Votre ville"
                />
              ) : (
                <span className="text-sm">{profile.city || "Ville non définie"}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
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
      <div className="bg-card p-3 rounded-lg shadow-sm border">
        <QRCodeSVG
          value={window.location.href}
          size={120}
          level="H"
          includeMargin={true}
        />
      </div>
    </div>
  );
}