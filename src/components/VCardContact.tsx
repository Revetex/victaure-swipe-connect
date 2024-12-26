import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";
import { Mail, Phone, MapPin } from "lucide-react";
import { VCardSection } from "./VCardSection";

interface VCardContactProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
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
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="flex-1"
                placeholder="Votre téléphone"
              />
            ) : (
              <span className="text-sm">{profile.phone || "Téléphone non défini"}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground">Montréal, QC</span>
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